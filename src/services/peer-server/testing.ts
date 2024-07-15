import { createHash } from 'crypto'

const DEFAULT_SEED = 7357

export function digest(ids: string[]) {
    if (ids.length === 0) {
        return DEFAULT_SEED
    }
    
    const hash = ids.reduce((hash, id) => hash.update(id), createHash('sha256'))
    const seed = parseInt(hash.digest('hex').substring(0, 8), 16)
    
    return seed
}