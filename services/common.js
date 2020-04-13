export const returnBody = (code, data, msg) => {
  return {
    code,
    data: data || '',
    msg: msg || ''
  }
}