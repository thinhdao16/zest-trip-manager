export const generateRowsPerPageOptions = (count) => {
  const options = [];
  const pageSize = 5;
  for (let i = pageSize; i <= count; i += pageSize) {
    options.push(i);
  }

  if (!options.includes(count)) {
    options.push(count);
  }

  return options;
};
