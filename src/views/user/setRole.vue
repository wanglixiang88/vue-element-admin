<template>
  <div class="app-container">

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="listDate.list"
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
          <el-checkbox v-for="(item,index) in row.arryList" v-model="item.arryChecked" :checked="item.arryChecked" :key="item.arryValue">{{ item.arryName }}</el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" style="width:100%" @click="saveRoleInfo">保存-父组件传过来的值：{{roleIdValue}}</el-button>

  </div>
</template>

<script>
import { getRoleMenuList, saveRolePower } from '@/api/UserRoleAPI'
import waves from '@/directive/waves'

export default {
  name: 'ComplexTable',
  props:[ 'roleIdValue' ],
  directives: { waves },
  watch:{
    roleIdValue:{
      handler(newVal,oldVal){
        this.listDate.roleId=newVal;
        this.getList()
        console.log('父组件传到子组件的值修改前：'+oldVal+'，修改后：'+newVal)
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      listQuery: {
        roleId:this.roleIdValue
      },
      listDate:{
        list:null,
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
      this.listDate.list = null;
      getRoleMenuList(this.listDate).then(response => {
        this.listDate.list = response.data.item
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    saveRoleInfo(){
      saveRolePower(this.listDate).then(response=>{
         this.$notify({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            })
      })
    }
  }
}
</script>
