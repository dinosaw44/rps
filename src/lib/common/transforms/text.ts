export const capitalize = (words: string) => {
    const capital = (letter: string) => letter.toUpperCase()
    return words.replaceAll(/(^[a-z]| [a-z])/g, capital)
}

export const pathToLabel = (pathname: string, root: string) => {
    const segment = pathname.split('/').filter(Boolean).pop()
    return capitalize(segment?.replaceAll('-', ' ') ?? root)
}