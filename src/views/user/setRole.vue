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
      <el-table-column label="页面功能">
        <template slot-scope="{row}">
          <el-checkbox v-for="(item,index) in row.arryList" :checked="item.arryChecked" :key="item.arryValue">{{ item.arryName }}</el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" style="width:100%">保存-父组件传过来的值：{{roleIdValue}}</el-button>

  </div>
</template>

<script>
import { getRoleMenuList } from '@/api/UserRoleAPI'
import waves from '@/directive/waves'

export default {
  name: 'ComplexTable',
  props:[ 'roleIdValue' ],
  directives: { waves },
  watch:{
    roleIdValue:{
      handler(newVal,oldVal){
        this.listQuery.roleId=newVal;
        this.getList()
        console.log('父组件传到子组件的值修改前：'+oldVal+'，修改后：'+newVal)
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: false,
      listQuery: {
        roleId:this.roleIdValue
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.list = null;
      getRoleMenuList(this.listQuery).then(response => {
        this.list = response.data.item
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
