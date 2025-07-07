import { insertIntoJazzList } from "./jazz";
describe('insertIntoJazzList', () => {
  it('inserts an item at the beginning of the list', () => {
    const list = [2, 3, 4];
    insertIntoJazzList(list, 1, 0);
    expect(list).toEqual([1, 2, 3, 4]);
  });

  it('inserts an item at an arbitrary position', () => {
    const list = [1, 2, 4, 5];
    insertIntoJazzList(list, 3, 2);
    expect(list).toEqual([1, 2, 3, 4, 5]);
  });
});
