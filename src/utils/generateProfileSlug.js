const generateProfileSlug = (email) => {
  return email
    .toLowerCase()
    .replace(/@/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export default generateProfileSlug;
