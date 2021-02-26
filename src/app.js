import { getDataFromApi, addTaskToApi, deleteTaskToApi } from './data';
import { tableRowForDeleteIconReturner, taskHtmlCreator } from './helpers';

class PomodoroApp {
  constructor(options) {
    // Elementler
    const { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.taskFormAddButton = document.getElementById('addButton');

    // Sabit
    this.deleteIcon = `assets/images/icons/delete.png`;
  }

  // eslint-disable-next-line class-methods-use-this
  handleDeleteTask(taskId) {
    const $deletingTask = tableRowForDeleteIconReturner(`tr[data-id="${taskId}"] img`);
    $deletingTask.style.cursor = 'pointer';
    $deletingTask.addEventListener('click', () => {
      tableRowForDeleteIconReturner(`tr[data-id="${taskId}"]`).remove();
      deleteTaskToApi(taskId);
    });
  }

  addTask(task) {
    // Input value mutlaka burada boşaltılmalıdır, diğer bölgelerde veri eklenirken senktron kaybı
    // yaşanabilmektedir.
    this.$taskFormInput.value = '';
    // Buton yazısında ekleniyor bilgisi verilirken, inputa veri girildiğinde aktif oluyor,
    // bunu engelleyebilmek için inputu disabled yapmamız doğru olacaktır.
    this.$taskFormInput.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.taskFormAddButton.innerText = 'Add Task';
        // veri girişinin disabled özelliği kaldırıldıktan sonra tekrar yazılabilir hale
        // getirebilmek için focus methodundan yararlanıyoruz.
        this.$taskFormInput.disabled = false;
        this.$taskFormInput.focus();
      });
  }

  addTaskToTable(task) {
    const $newTaskEl = document.createElement('tr');
    // Her oluşturulan tablo satırımıza data-id özelliği atıyoruz, atanan özelliğin değeri
    // mockapi.io dan dönen cevap içeriğinde bulunmaktadır.
    $newTaskEl.setAttribute('data-id', task.id);
    const reArrangedTask = {
      ...task,
      deleteIcon: this.deleteIcon,
    };
    $newTaskEl.innerHTML = taskHtmlCreator(reArrangedTask);
    this.$tableTbody.appendChild($newTaskEl);
    this.handleDeleteTask(task.id);
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.taskFormAddButton.innerText = 'ekleniyor';
      const task = { title: this.$taskFormInput.value };
      this.taskFormAddButton.disabled = true;
      this.addTask(task);
    });
  }

  handleTaskTitleInput() {
    this.$taskFormInput.addEventListener('keyup', () => {
      const input = this.$taskFormInput.value;
      // veri girişi yapılırken sadece boşluk ve kelimeler arası 1 karakterden fazla boşluk kabul
      // edilmemektedir.
      const patternedInput = input.replace(/\s+/g, ' ').trim();
      if (patternedInput.length > 0) {
        this.taskFormAddButton.disabled = false;
      } else {
        this.taskFormAddButton.disabled = true;
      }
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task) => {
        this.addTaskToTable(task);
      });
    });
  }

  init() {
    this.handleTaskTitleInput();
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
