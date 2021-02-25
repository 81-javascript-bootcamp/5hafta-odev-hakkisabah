// Aksiyonların bağımlılıkları
export const tableRowForDeleteIconReturner = (param) => {
  return document.querySelector(param);
};
export const taskHtmlCreator = (task) => {
  return `<th scope="row">${task.id}</th><td>${task.title}</td><td>
    <img class='delete-icon' src='${task.deleteIcon}'></td>`;
};
