<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="menuId"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单Id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.menuId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.route }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标样式" align="center">
        <template slot-scope="{row}">
          <i :class="row.iconClass"></i>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="页面功能">
        <template slot-scope="{row}">
          <el-tag v-for="(item,index) in JSON.parse(row.operation)" :key="index" size="mini" style="margin-left:10px;">{{ item.arryName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleModify(row)">
            <i class="el-icon-edit"></i>编辑
          </el-button>
          <el-popconfirm
            style="margin-left:10px;"
            confirm-button-text="确认"
            cancel-button-text="取消"
            size="mini"
            icon="el-icon-info"
            icon-color="red"
            title="确认要删除此条记录？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" type="danger" size="mini">
              <i class="el-icon-delete" />删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width:90%; margin:0px auto ">
        <!-- 调用树形下拉框组件 -->
        <el-form-item label="上级菜单">
          <SelectTree
            ref="child"
            :props="props"
            :options="optionData"
            :value="temp.parentId"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue($event)" />
        </el-form-item>
        <el-form-item label="菜单名" prop="menuName">
          <el-input v-model="temp.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="temp.route" placeholder="请输入点击菜单跳转的路径" />
        </el-form-item>
        <el-form-item label="图标样式">
          <el-input v-model="temp.iconClass" placeholder="请输入图标样式" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.sequence" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="页面功能">
          <el-checkbox-group v-model="checkedCities1" @change="getOperation()">
            <el-checkbox v-for="(i,index) in optionsList" :key="index" :label="i.arryValue">{{ i.arryName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item align="right">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="createData()">
            提交保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuList, saveMenu, deleteMenu } from '@/api/MenuAPI'
import waves from '@/directive/waves'
import SelectTree from '@/components/TreeSelect'

export default {
  name: 'ComplexTable',
  components: { SelectTree },
  directives: { waves },
  data() {
    return {
      checkedCities1: ['insert'],
      optionsList: [
        { arryName: '增加', arryValue: 'insert' },
        { arryName: '删除', arryValue: 'delete' },
        { arryName: '查询', arryValue: 'select' },
        { arryName: '修改', arryValue: 'update' },
        { arryName: '导出', arryValue: 'export' }],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        value: 'menuId',
        label: 'menuName',
        children: 'children'
      },
      // 以上为配置树形下拉框所使用的参数
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        sort: 'ASC',
        sidx: 'sequence',
        parameterJson: [
        ]
      },
      temp: {
        menuId: null,
        parentId: null,
        menuName: '',
        route: '',
        sequence: null,
        iconClass: '',
        jsonOperation: [],
        operation: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新菜单信息',
        create: '添加菜单信息'
      },
      rules: {
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  computed: {
    optionData() {
      return this.list
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getMenuList(this.listQuery).then(response => {
        this.list = response.data.item
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },
    handleModify(row) {
      this.temp = {
        menuId: row.menuId,
        parentId: row.parentId,
        menuName: row.menuName,
        route: row.route,
        sequence: row.sequence,
        iconClass: row.iconClass,
        jsonOperation: row.modelOperation,
        operation: row.operation
      }
      this.checkedCities1 = row.modelOperation // true
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        if (this.temp.parentId == null || this.temp.parentId === '') {
          this.$refs.child.clearHandle() // 清空组件选中的值
        }
      })
    },
    resetTemp() {
      this.temp = {
        menuId: null,
        parentId: null,
        menuName: '',
        route: '',
        sequence: null,
        iconClass: '',
        jsonOperation: [],
        operation: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.checkedCities1 = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.operation = JSON.stringify(this.temp.jsonOperation)
          saveMenu(this.temp).then((res) => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteMenu({ menuId: row.menuId }).then((res) => {
        this.$notify({
          title: 'Success',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    getValue(value) {
      this.temp.parentId = value
    },
    getOperation() {
      this.temp.jsonOperation = this.checkedCities1
    }
  }
}
</script>
