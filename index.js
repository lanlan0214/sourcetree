const { createApp, onMounted, reactive, ref, nextTick } = Vue;

let alreadySetupGridHTML = false;

function setupTableGrid() {
  function columnTemplateFunction() {
    return '<input class="roleDropDownList" />';
  }
  function onRoleChange(e) {
    const element = e.sender.element;
    const row = element.closest('tr');
    const grid = $('#grid').data('kendoGrid');
    const dataItem = grid.dataItem(row);
    dataItem.set('role', e.sender.value());
    console.log(e.sender.value());
  }
  const roleOption = [
    {
      role: 1,
      displayValue: '1'
    },
    {
      role: 2,
      displayValue: '2'
    },
    {
      role: 3,
      displayValue: '3'
    }
  ];
  $(document).ready(function () {
    // eslint-disable-next-line max-nested-callbacks
    const grid = $('#grid').kendoGrid({
      columns: [
        { selectable: true, width: '40px' },
        {
          field: 'userName',
          title: 'Printer Name',
          attributes: { style: 'color: 2958ec' },
          width: 120
        },
        { field: 'email', title: 'Printer TYPE', width: 160 },
        { field: 'name', title: 'Printer STATE', width: '92px' },
        {
          field: 'role',
          title: 'GROUPS',
          width: 88,
          template: columnTemplateFunction
        },
        {
          field: 'connectionName',
          title: 'PROTOCAL NAME',
          width: 104
        },
        { field: 'group', title: 'PROTOCAL ADAPTER', width: 120 },
        { field: 'group', title: 'ACTIVE IP ADDRESS', width: 110 }
      ],
      dataSource: {
        pageSize: 15,
        transport: {
          read: {
            url: '../src/assets/data/mock-system.json'
          }
        },
        schema: {
          model: {
            id: 'id'
          }
        }
      },
      dataBound: function (e) {
        const grid = e.sender;
        const items = e.sender.items();

        // eslint-disable-next-line max-nested-callbacks, no-unused-vars
        items.each(function (event) {
          const dataItem = grid.dataItem(this);
          const ddt = $(this).find('.roleDropDownList');

          $(ddt).kendoDropDownList({
            value: dataItem.role,
            dataSource: roleOption,
            dataTextField: 'displayValue',
            dataValueField: 'role',
            change: onRoleChange
          });

          setDraggable();
        });
      },
      pageable: {
        refresh: false,
        pageSizes: true
      },
      scrollable: true,
      height: '100%',
      persistSelection: true,
      sortable: true,
      toolbar: ['excel'],
      excel: {
        fileName: 'printer-devices.xlsx'
      },
      search: {
        fields: [
          { name: 'userName', operator: 'contains' },
          { name: 'name', operator: 'contains' },
          { name: 'email', operator: 'contains' },
          { name: 'role', operator: 'contains' },
          { name: 'connectionName', operator: 'contains' },
          { name: 'group', operator: 'contains' }
        ]
      }
    });
    grid.on('change', '.k-select-checkbox.k-checkbox', onSelectChange);
    function onSelectChange() {
      const grid = $('#grid').data('kendoGrid');
      selectedAmount.value = grid.selectedKeyNames().length;
      setDraggable(grid.selectedKeyNames());
      console.log(grid.selectedKeyNames());
    }
    resetHTML();
  });
}

function resetHTML() {
  if (alreadySetupGridHTML) return;
  const toolBarTitle = document.createElement('div');
  const searchInputParent = document.querySelector('.k-toolbar.k-grid-toolbar');
  const exportText = document.querySelector('.k-grid-excel > .k-button-text');
  toolBarTitle.innerText = `${'Printers 239'}`;
  toolBarTitle.id = 'toolbar-title';
  exportText.innerText = 'Export Devices';
  searchInputParent.appendChild(toolBarTitle);
  alreadySetupGridHTML = true;
}
function setDraggable() {
  if (screen.width < 576) return;
  // 設定可拖動的物件
  $('.k-master-row').kendoDraggable({
    hint: function () {
      return `<div id='on-drop-hint'>Selected ${selectedAmount.value} User${
        selectedAmount.value >= 2 ? 's' : ''
      }<div>`;
    }
  });
  // 設定可被放置的物件
  $('.nest-out').kendoDropTargetArea({
    filter: '.nest-in',
    drop: onDrop
  });
  function onDrop(targetArea) {
    const grid = $('#grid').data('kendoGrid');
    const target = targetArea.dropTarget.context;
    // 可用 target 的 attribute data-grid 來處理要操作的grid data
    console.log('被拖放的物件', target, target.getAttribute('data-grid'));
    console.log('當前選取的item Key: ', grid.selectedKeyNames());
  }
}

createApp({
  setup() {
    // initial data
    const menuToggle = ref(false);
    const activeNestOut = ref(0);
    const activeNestIn = ref(0);
    const selectedAmount = ref(0);
    const sidebarToggle = ref(true);
    const tablePlusToggle = ref(false);
    const curContentsType = ref(0);
    onMounted(() => {
      nextTick(() => {
        setupTableGrid();
      });
    });
    return {
      sidebar: reactive([
        {
          id: 0,
          name: 'TSC Factory A',
          child: [
            {
              id: 0,
              name: 'Work Station 01'
            },
            {
              id: 1,
              name: 'Work Station 02 '
            },
            {
              id: 2,
              name: 'General Permissions'
            }
          ]
        },
        {
          id: 1,
          name: 'TSC Factory B',
          child: [
            {
              id: 0,
              name: 'Child Example'
            }
          ]
        },
        {
          id: 2,
          name: 'TSC Factory C',
          child: [
            {
              id: 0,
              name: 'Child Example'
            }
          ]
        },
        {
          id: 3,
          name: 'TSC Factory D',
          child: [
            {
              id: 0,
              name: 'Child Example'
            }
          ]
        }
      ]),
      menuToggle,
      activeNestOut,
      activeNestIn,
      selectedAmount,
      sidebarToggle,
      tablePlusToggle,
      curContentsType
    };
  },
  methods: {
    clickMenu() {
      this.menuToggle = !this.menuToggle;
    },
    switchNest(isOut = true, id = -1) {
      if (isOut) {
        this.activeNestOut = id;
        this.activeNestIn = 0;
      } else {
        this.activeNestIn = id;
      }
    },
    switchContents(type) {
      if (type === 0) {
        this.curContentsType = 0;
      }
      if (type === 1) {
        this.curContentsType = 1;
        const grid = $('#grid').data('kendoGrid');
        grid.dataSource.page(1);
        grid.dataSource.read();
      }
    },
    cancelSelection() {
      const grid = $('#grid').data('kendoGrid');
      grid._selectedIds = {};
      grid.clearSelection();
      this.selectedAmount = 0;
      console.log(this.selectedAmount.value);
    }
  }
}).mount('#app');
