import { A as emberA } from '@ember/array';

export default function (start, end) {
  const array = emberA();

  for (let i = start; i <= end; i += 1) {
    array.push({
      id: i,
      name: `Thing ${i}`,
    });
  }

  return array;
}
