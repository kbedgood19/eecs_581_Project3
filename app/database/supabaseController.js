
import { supabase } from './supabase';


export async function getMediaCatalog(
    userId,
    searchQuery = '',
    filterType = 'All',
    sortBy = 'title_asc',
    formatFilter = 'All'
) {
    let query = supabase
        .from('MediaItem')
        .select(`
            id,
            title,
            genre,
            releaseYear,
            photo_uri,
            copy_number,
            dateAdded,
            MediaType!MediaItem_type_id_fkey(type_name),
            MediaFormat!MediaItem_format_id_fkey(format_name),
            UserFeedback(score)
        `)
        .eq('user_id', userId);

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching media:', error.message);
        throw error;
    }

    // Marie: SUPABASE INTEGRATION
    let results = data.map(item => {
        const feedback = Array.isArray(item.UserFeedback)
            ? item.UserFeedback[0]
            : item.UserFeedback;

        return {
            ...item,
            type_name: item.MediaType?.type_name,
            format_name: item.MediaFormat?.format_name,
            rating: feedback?.score ?? null
        };
    });

    if (searchQuery.trim() !== '') {
        results = results.filter(item =>
            item.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }

    if (filterType !== 'All') {
        let dbType = filterType;
        if (filterType === 'Movies') dbType = 'Movie';
        if (filterType === 'Books') dbType = 'Book';
        if (filterType === 'Video Games') dbType = 'VideoGame';

        results = results.filter(item => item.type_name === dbType);
    }

    // Marie: FORMAT INTEGRATION
    if (formatFilter !== 'All') {
        results = results.filter(
            item => item.format_name?.toLowerCase() === formatFilter.toLowerCase()
        );
    }

    if (sortBy === 'title_asc') {
        results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'date_added') {
        results.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'rating_desc') {
        results.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    }

    return results;
}

export async function addMediaItem(
    title,
    mediaType,
    genre,
    releaseYear,
    subtypeData,
    userId,
    photoUri = null,
    rating = null,
    review = null,
    copyNumber = 1
) {
    // Get or create the media type.
    let { data: type, error: typeError } = await supabase
        .from('MediaType')
        .select('type_id')
        .eq('type_name', mediaType)
        .maybeSingle();

    if (typeError) throw typeError;

    if (!type) {
        const { data, error } = await supabase
            .from('MediaType')
            .insert(
                {type_name: mediaType}
            )
            .select('type_id')
            .single();

        if (error) throw error;
        type = data;
    }

    // FORMAT INTEGRATION
    // use the selected format or fall back to Unspecified
    const formatName = subtypeData?.format || 'Unspecified';

    let { data: format, error: formatError } = await supabase
        .from('MediaFormat')
        .select('format_id')
        .eq('type_id', type.type_id)
        .eq('format_name', formatName)
        .maybeSingle();

    if (formatError) throw formatError;

    if (!format) {
        const { data, error } = await supabase
            .from('MediaFormat')
            .insert({
                type_id: type.type_id,
                format_name: formatName
            })
            .select('format_id')
            .single();

        if (error) throw error;
        format = data;
    }

    // Save the main media item.
    const { data: item, error: itemError } = await supabase
        .from('MediaItem')
        .insert({
            type_id: type.type_id,
            title,
            genre,
            releaseYear,
            format_id: format.format_id,
            user_id: userId,
            photo_uri: photoUri,
            copy_number: copyNumber
        })
        .select('id')
        .single();

    if (itemError) throw itemError;

    const newId = item.id;

    // Save information specific to the media type.
    let tableName = null;
    let details = null;

    if (mediaType === 'Movie' && subtypeData?.director) {
        tableName = 'Movie';
        details = { director: subtypeData.director };
    } else if (mediaType === 'Book' && subtypeData?.author) {
        tableName = 'Book';
        details = { author: subtypeData.author };
    } else if (mediaType === 'Music' && subtypeData?.artist) {
        tableName = 'Music';
        details = { artist: subtypeData.artist };
    } else if (mediaType === 'VideoGame' && subtypeData?.developer) {
        tableName = 'VideoGame';
        details = { developer: subtypeData.developer };
    }

    if (tableName) {
        const { error } = await supabase
            .from(tableName)
            .insert({
                media_id: newId,
                ...details
            });

        if (error) throw error;
    }

    // Marie: added const hasRating and hasReview to ensure empty strings or 0 dont cause an error
    const hasRating = rating !== null && rating !== undefined && rating > 0;
    const hasReview = typeof review === 'string' && review.trim() !== '';
   
    // Save rating and review, if provided.
    if (hasRating || hasReview) {
        const { error } = await supabase
            .from('UserFeedback')
            .insert({
                media_id: newId,
                score: hasRating ? rating : null, // allow for no rating
                reviewText: hasReview ? review.trim() : null // allow for no review
            });

        if (error) throw error;
    }

    return newId;
}

// Marie: check for duplicate media when adding an item
export async function checkDuplicateMedia(userId, title, typeName) {
    const normalizedTitle = title.trim().toLowerCase();

    const { data, error } = await supabase
        .from('MediaItem')
        .select(`
            id,
            title,
            copy_number,
            MediaType!MediaItem_type_id_fkey!inner(type_name)
        `)
        .eq('user_id', userId)
        .eq('MediaType.type_name', typeName)
        .order('copy_number', { ascending: false });

    if (error) {
        console.error('Error checking duplicate media:', error.message);
        throw error;
    }

    // match case-insensitively and ignore leading/trailing spaces
    const duplicate = data.find(
        item => item.title.trim().toLowerCase() === normalizedTitle
    );

    return duplicate ? { id: duplicate.id, copy_number: duplicate.copy_number } : null;
}

// Marie: SUPABASE INTEGRATION
export async function getMediaItemById(id) {
    const { data, error } = await supabase
        .from('MediaItem')
        .select(`
            id,
            title,
            genre,
            releaseYear,
            photo_uri,
            copy_number,
            MediaType!MediaItem_type_id_fkey(type_name),
            MediaFormat!MediaItem_format_id_fkey(format_name),
            Movie(director),
            Book(author),
            Music(artist),
            VideoGame(developer),
            UserFeedback(score, reviewText)
        `)
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('Error fetching media item by id:', error.message);
        throw error;
    }

    if (!data) return null;

    // unwrap handles both single-object and single-element-array join responses
    const unwrap = (val) => (Array.isArray(val) ? val[0] : val);
    const movie = unwrap(data.Movie);
    const book = unwrap(data.Book);
    const music = unwrap(data.Music);
    const videoGame = unwrap(data.VideoGame);
    const feedback = unwrap(data.UserFeedback);

    return {
        id: data.id,
        title: data.title,
        genre: data.genre,
        releaseYear: data.releaseYear,
        photo_uri: data.photo_uri,
        copy_number: data.copy_number,
        type_name: data.MediaType?.type_name ?? null,
        format_name: data.MediaFormat?.format_name ?? null,
        director: movie?.director ?? null,
        author: book?.author ?? null,
        artist: music?.artist ?? null,
        developer: videoGame?.developer ?? null,
        rating: feedback?.score ?? null,
        review: feedback?.reviewText ?? null
    };
}

// Marie: SUPABASE INTEGRATION
export async function updateMediaItem(
    id,
    title,
    genre,
    releaseYear,
    typeName,
    subtypeData,
    photoUri = undefined,
    rating = null,
    review = null
) {
    // 1. build MediaItem updates (only touch photo_uri if explicitly passed)
    const updates = { title, genre, releaseYear };
    if (photoUri !== undefined) {
        updates.photo_uri = photoUri;
    }

    // look up or create the selected format_id when a format is provided
    if (subtypeData?.format) {
        const { data: type, error: typeError } = await supabase
            .from('MediaType')
            .select('type_id')
            .eq('type_name', typeName)
            .maybeSingle();

        if (typeError) throw typeError;

        if (type) {
            let { data: format, error: formatError } = await supabase
                .from('MediaFormat')
                .select('format_id')
                .eq('type_id', type.type_id)
                .eq('format_name', subtypeData.format)
                .maybeSingle();

            if (formatError) throw formatError;

            if (!format) {
                const { data: newFormat, error: newFormatError } = await supabase
                    .from('MediaFormat')
                    .insert({
                        type_id: type.type_id,
                        format_name: subtypeData.format
                    })
                    .select('format_id')
                    .single();

                if (newFormatError) throw newFormatError;
                format = newFormat;
            }

            updates.format_id = format.format_id;
        }
    }

    // update the main MediaItem row once with all fields including format_id
    const { error: itemError } = await supabase
        .from('MediaItem')
        .update(updates)
        .eq('id', id);

    if (itemError) throw itemError;

    // 2. upsert subtype table so missing subtype rows get created instead of failing
    let tableName = null;
    let details = null;

    if (typeName === 'Movie') {
        tableName = 'Movie';
        details = { director: subtypeData?.director || '' };
    } else if (typeName === 'Book') {
        tableName = 'Book';
        details = { author: subtypeData?.author || '' };
    } else if (typeName === 'Music') {
        tableName = 'Music';
        details = { artist: subtypeData?.artist || '' };
    } else if (typeName === 'VideoGame') {
        tableName = 'VideoGame';
        details = { developer: subtypeData?.developer || '' };
    }

    if (tableName) {
        const { error: subtypeError } = await supabase
            .from(tableName)
            .upsert({ media_id: id, ...details }, { onConflict: 'media_id' });

        if (subtypeError) throw subtypeError;
    }

    // 3. upsert UserFeedback when a rating or review is provided, or remove it if both were cleared
    const hasRating = rating !== null && rating !== undefined && rating > 0;
    const hasReview = typeof review === 'string' && review.trim() !== '';

    if (hasRating || hasReview) {
        const today = new Date().toISOString().split('T')[0];

        const { error: feedbackError } = await supabase
            .from('UserFeedback')
            .upsert(
                {
                    media_id: id,
                    score: hasRating ? rating : null,
                    reviewText: hasReview ? review.trim() : null,
                    dateModified: today
                },
                { onConflict: 'media_id' }
            );

        if (feedbackError) throw feedbackError;
    } else {
        
        // SPRINT 3 (Marie): delete existing feedback row when both rating and review are cleared
        const { error: deleteFeedbackError } = await supabase
            .from('UserFeedback')
            .delete()
            .eq('media_id', id);

        if (deleteFeedbackError) throw deleteFeedbackError;
    }
}

// Marie: SUPABASE INTEGRATION
export async function deleteMediaItem(id) {
    // 1. delete from child tables first to satisfy foreign key constraints
    const childTables = ['Movie', 'Book', 'Music', 'VideoGame', 'UserFeedback'];

    for (const table of childTables) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('media_id', id);

        if (error) throw error;
    }

    // 2. delete the main MediaItem record
    const { error: itemError } = await supabase
        .from('MediaItem')
        .delete()
        .eq('id', id);

    if (itemError) throw itemError;
}

// SPRINT 3 (Jaydine) - function to get the Favorite Media list
export async function getFavoriteMedia(
    userId,
    searchQuery = '',
    filterType = 'All',
    sortBy = 'title_asc',
    formatFilter = 'All'
) {
    
    // SPRINT 3 (Jaydine) - REQUIREMENT 13
    // PSEUDOCODE (GET FAVORITES - REQ 13.1):
    // 1. Call getMediaCatalog(userId, searchQuery, filterType, sortBy, formatFilter)
    // 2. Filter the returned array so ONLY items with rating !== null && rating >= 5 are kept
    // 3. Return the filtered array

    // TODO: replace placeholder below using the pseudocode above
    return [];
}