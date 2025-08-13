/**
 * @function updateObject
 * @description It is used to update easily the objects instead of spread
 * operators around all the code.
 * @param {Object} actualState
 * @param {Object} updatedValues
 */
export const updateObject = (actualState: object, updatedValues: object) => ({
    ...actualState,
    ...updatedValues,
});

export const getPageTitleFromPath = (path: string): string => {
    if (path === '/') return 'Home';

    const cleanPath = path.replace(/\[.*?\]/g, '');

    const segments = cleanPath.split('/').filter(Boolean);
    const words = segments.map((segment) => segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

    return words.join(' ') || 'WingGo';
};

export const getImageFromCloudinary = (path: string): string => {
    return `https://res.cloudinary.com/winggoimagelibrary/image/upload/${process.env.CLOUDINARY_ID}/${path}`;
};
