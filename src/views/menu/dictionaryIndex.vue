<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.parameterJson[0].paramValue" placeholder="菜单名称" style="width:200px; margin-right:10px;" class="filter-item" />
      <el-select v-model="listQuery.sort" class="filter-item" style="margin-right:10px;" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
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
      row-key="arryId"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column label="字典ID" align="center" :class-name="getSortClass('arryId')">
        <template slot-scope="{row}">
          <span>{{ row.arryId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.arryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.arryValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

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
        <el-form-item label="名称" prop="arryName">
          <el-input v-model="temp.arryName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="temp.arryValue" placeholder="请输入编号" />
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
import { getDictionaryList, saveDictionary, deleteDictionary } from '@/api/DictionaryAPI'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import SelectTree from '@/components/TreeSelect'

export default {
  name: 'ComplexTable',
  components: { Pagination, SelectTree },
  directives: { waves },
  data() {
    return {
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        value: 'arryId',
        label: 'arryName',
        children: 'children'
      },
      // 以上为配置树形下拉框所使用的参数
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: 'ASC',
        sidx: 'arryId',
        parameterJson: [
          { paramName: 'arryName', paramValue: '', Operation: 'Like' }
        ]
      },
      sortOptions: [{ label: '根据排序字段升序排列', key: 'ASC' }, { label: '根据排序字段降序排列', key: 'DESC' }],
      temp: {
        arryId: null,
        parentId: null,
        arryName: '',
        arryValue: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新数据字典',
        create: '添加数据字典'
      },
      rules: {
        arryName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
      getDictionaryList(this.listQuery).then(response => {
        this.list = response.data.item
        this.total = response.data.total

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModify(row) {
      this.temp = {
        arryId: row.arryId,
        parentId: row.parentId,
        arryName: row.arryName,
        arryValue: row.arryValue
      }
      console.log('this.temp')
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        if (this.temp.parentId == null || this.temp.parentId === '') {
          this.$refs.child.clearHandle() // 清空组件选中的值
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        arryId: '',
        parentId: '',
        arryName: '',
        arryValue: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveDictionary(this.temp).then((res) => {
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
      deleteDictionary({ arryId: row.arryId }).then((res) => {
        this.$notify({
          title: 'Success',
          message: res.message,
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    getValue(value) {
      this.temp.parentId = value
    }
  }
}
</script>
