const { createApp, onMounted, reactive, ref, nextTick } = Vue;

createApp({
  setup() {
    // initial data
    const menuToggle = ref(false);
    const mainMenuToggle = ref(false);
    const activeNestOut = ref(0);
    const activeNestIn = ref(0);
    const selectedAmount = ref(0);
    const sidebarToggle = ref(true);
    onMounted(() => {
      nextTick(() => {
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
                title: 'USERNAME',
                attributes: { style: 'color: 2958ec' },
                width: 140
              },
              { field: 'name', title: 'NAME', width: 140 },
              { field: 'email', title: 'EMAIL', width: '220px' },
              {
                field: 'role',
                title: 'ROLES',
                width: 72,
                template: columnTemplateFunction
              },
              {
                field: 'connectionName',
                title: 'CONNECTION NAME',
                width: 240
              },
              { field: 'group', title: 'GROUPS', width: 100 }
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
            toolbar: ['search'],
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

        function resetHTML() {
          const searchInput = document.querySelector('.k-input-inner');
          const searchInputParent = document.querySelector(
            '.k-toolbar.k-grid-toolbar'
          );
          const spacer = document.querySelector(
            '.k-toolbar.k-grid-toolbar > .k-spacer'
          );
          const createUserButton = document.createElement('button');
          const toolBarTitle = document.createElement('div');
          const addIcon = document.createElement('img');
          addIcon.src = './src/assets/img/system/add.svg';
          toolBarTitle.innerText = `${'User9'}`;
          toolBarTitle.id = 'toolbar-title';
          createUserButton.innerText = 'Add User';
          createUserButton.id = 'create-user-button';
          createUserButton.appendChild(addIcon);
          spacer.style.display = 'none';
          searchInput.placeholder = 'Search for Users';
          searchInputParent.appendChild(createUserButton);
          searchInputParent.appendChild(toolBarTitle);
        }
        function setDraggable() {
          if (screen.width < 576) return;
          // ????????????????????????
          $('.k-master-row').kendoDraggable({
            hint: function () {
              return `<div id='on-drop-hint'>Selected ${
                selectedAmount.value
              } User${selectedAmount.value >= 2 ? 's' : ''}<div>`;
            }
          });
          // ???????????????????????????
          $('.nest-out').kendoDropTargetArea({
            filter: '.nest-in',
            drop: onDrop
          });
          function onDrop(targetArea) {
            const grid = $('#grid').data('kendoGrid');
            const target = targetArea.dropTarget.context;
            // ?????? target ??? attribute data-grid ?????????????????????grid data
            console.log(
              '??????????????????',
              target,
              target.getAttribute('data-grid')
            );
            console.log('???????????????item Key: ', grid.selectedKeyNames());
          }
        }
      });
    });
    return {
      sidebar: reactive([
        {
          id: 0,
          name: 'Administrator',
          child: [
            {
              id: 0,
              name: 'Users'
            },
            {
              id: 1,
              name: 'Groups '
            },
            {
              id: 2,
              name: 'General Permissions'
            }
          ]
        },
        {
          id: 1,
          name: 'DQA',
          child: [
            {
              id: 0,
              name: 'Child Example'
            }
          ]
        },
        {
          id: 2,
          name: 'Global User',
          child: [
            {
              id: 0,
              name: 'Child Example'
            }
          ]
        },
        {
          id: 3,
          name: 'IT Support',
          child: [
            {
              id: 0,
              name: 'Child Example'
            }
          ]
        }
      ]),
      mainMenu: reactive([
        {
          id: 0,
          name: '????????????',
          child: [
            {
              id: 0,
              name: '????????????',
              icon: './src/assets/img/menu/printer.png'
            },
            {
              id: 1,
              name: '????????????',
              icon: './src/assets/img/menu/device_information.png'
            },
            {
              id: 2,
              name: '????????????',
              icon: './src/assets/img/menu/device.png'
            },
            {
              id: 3,
              name: '????????????',
              icon: './src/assets/img/menu/device_rule.png'
            },
            {
              id: 4,
              name: '????????????',
              icon: './src/assets/img/menu/device_informationedit.png'
            },
          ]
        },
        {
          id: 1,
          name: '????????????',
          child: [
            {
              id: 0,
              name: '????????????',
              icon: './src/assets/img/menu/account_maintenance.png'
            },
            {
              id: 1,
              name: '????????????',
              icon: './src/assets/img/menu/role_maintenance.png'
            },
            {
              id: 2,
              name: '????????????',
              icon: './src/assets/img/menu/parameter.png'
            },
            {
              id: 3,
              name: '????????????',
              icon: './src/assets/img/menu/report.png'
            },
            {
              id: 4,
              name: '?????????',
              icon: './src/assets/img/menu/administrator.png'
            },
          ]
        },
        {
          id: 2,
          name: '????????????',
          child: [
            {
              id: 0,
              name: '????????????',
              icon: './src/assets/img/menu/report2.png'
            },
            {
              id: 1,
              name: '????????????',
              icon: './src/assets/img/menu/warning.png'
            },
            {
              id: 2,
              name: '????????????',
              icon: './src/assets/img/menu/manual.png'
            },
            
          ]
        },
        {
          id: 3,
          name: '????????????',
          child: [
            {
              id: 0,
              name: 'About',
              icon: './src/assets/img/menu/about.png'
            },
            {
              id: 1,
              name: 'Help',
              icon: './src/assets/img/menu/help.png'
            },
          ]
        },
      ]),
      menuToggle,
      activeNestOut,
      activeNestIn,
      selectedAmount,
      mainMenuToggle,
      sidebarToggle
    };
  },
  methods: {
    clickSidebarMenu() {
      this.menuToggle = !this.menuToggle;
    },
    clickMainMenu () {
      this.mainMenuToggle = !this.mainMenuToggle;
    },
    switchNest(isOut = true, id = -1) {
      if (isOut) {
        this.activeNestOut = id;
        this.activeNestIn = 0;
      } else {
        this.activeNestIn = id;
      }
    },
    cancelSelection() {
      const grid = $('#grid').data('kendoGrid');
      grid._selectedIds = {};
      grid.clearSelection();
      this.selectedAmount = 0;
      console.log(this.selectedAmount.value);
    },
  }
}).mount('#app');
