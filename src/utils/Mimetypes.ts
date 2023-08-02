const MIMETYPES = new Map<String, string>([
  ["audio/webm", "audio"],
  ["audio/ogg", "audio"],
  ["audio/aac", "audio"],
  ["audio/*", "audio"],
  ["image/jpeg", "image"],
  ["image/png", "image"],
  ["audio/mpeg", "image"],
]);

export default (mimetype: String) => {
  const obtained_mimetype = MIMETYPES.get(mimetype);
  console.log(mimetype);
  if (obtained_mimetype)
    return {
      data: {
        name: obtained_mimetype,
      },
    };
  return {
    error: {
      message: "mimetype not reconogized",
    },
  };
};
