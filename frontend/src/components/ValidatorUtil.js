export const getTrimmedValue = (event) => {
  event.preventDefault();
  const { name, value } = event.target;
  const val = value.trim();

  return { name, value };
}

export const minLength = (val, length) => val && val.length > length;

export const required = (val) => val;
