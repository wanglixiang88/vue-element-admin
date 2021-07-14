<template>
  <div class="app-container">

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
      @sort-change="sortChange"
    >
      <el-table-column label="菜单Id" align="center" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.menuId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="页面功能">
        <template slot-scope="{row}">
          <el-checkbox v-for="(item,index) in JSON.parse(row.operation)" :key="index">{{ item.arryName }}</el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" style="width:100%">保存-父组件传过来的值：{{roleIdValue}}</el-button>
    
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import { getMenuList } from '@/api/MenuAPI'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  props:[ 'roleIdValue' ],
  components: { Pagination },
  directives: { waves },
  watch:{
    roleIdValue:{
      handler(newVal,oldVal){
        console.log('父组件传到子组件的值修改前：'+oldVal+'，修改后：'+newVal)
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: 'ASC',
        sidx: 'sequence',
        parameterJson: [
          { paramName: 'roleId', paramValue: '', Operation: 'Equal' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMenuList(this.listQuery).then(response => {
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
