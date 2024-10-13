// const from =
//   "áàảãạâấầẩẫậăắằẳẵặóòỏõọôốồổỗộơớờởỡợéèẻẽẹêếềểễệúùủũụưứừửữựíìỉĩịýỳỷỹỵđ";
// const to =
//   "aaaaaaaaaaaaaaaaaoooooooooooooooooeeeeeeeeeeeuuuuuuuuuuuiiiiiyyyyyd";

// export default function buildSlug(input: String) {
//   let output = input.trim().toLowerCase();

//   for (let i = 0; i < from.length; i++) {
//     output = output.replace(new RegExp(from[i], "g"), to[i]);
//   }

//   return output.replace(/[^\w]+/g, "").replace(/ +/g, "-");
// }

const from =
  "áàảãạâấầẩẫậăắằẳẵặóòỏõọôốồổỗộơớờởỡợéèẻẽẹêếềểễệúùủũụưứừửữựíìỉĩịýỳỷỹỵđ";
const to =
  "aaaaaaaaaaaaaaaaaoooooooooooooooooeeeeeeeeeeeuuuuuuuuuuuiiiiiyyyyyd";
export default function buildSlug(input: String) {
  let output = input.trim().toLowerCase();
  for (let i = 0; i < from.length; i++) {
    output = output.replace(new RegExp(from[i], "g"), to[i]);
  }
  return output.replace(/[^\w ]+/g, "").replace(/ +/g, "-");
  // return input
  //   .trim()
  //   .toLowerCase()
  //   .replace(/[^\w ]+/g, '')
  //   .replace(/ +/g, '-');
}
