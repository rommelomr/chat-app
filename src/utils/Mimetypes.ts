const MIMETYPES = new Map<String, string>([
    ['audio/webm','audio'],
    ['audio/ogg','audio'],
    ['audio/aac','audio'],
    ['audio/*','audio'],
    ['image/jpeg','image'],
    ['image/png','image'],
    ['audio/mpeg','image'],
])

export default (mimetype: String) => {
    const funct = MIMETYPES.get(mimetype)
    if(funct) return {
        data: {
            name: funct
        }
    };
    return {
        error: {
            message: 'mimetype not reconogized'
        }
    }
    
}