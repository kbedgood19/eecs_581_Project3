
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

    let results = data.map(item => ({
        ...item,
        type_name: item.MediaType?.type_name,
        format_name: item.MediaFormat?.format_name,
        rating: item.UserFeedback?.score ?? null
    }));

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

    // Get or create the default format.
    let { data: format, error: formatError } = await supabase
        .from('MediaFormat')
        .select('format_id')
        .eq('type_id', type.type_id)
        .eq('format_name', 'Unspecified')
        .maybeSingle();

    if (formatError) throw formatError;

    if (!format) {
        const { data, error } = await supabase
            .from('MediaFormat')
            .insert({
                type_id: type.type_id,
                format_name: 'Unspecified'
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

    // Save rating and review, if provided.
    if (rating !== null || review !== null) {
        const { error } = await supabase
            .from('UserFeedback')
            .insert({
                media_id: newId,
                score: rating,
                reviewText: review
            });

        if (error) throw error;
    }

    return newId;
}
