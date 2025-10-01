import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from 'amis-editor';

// 导入样式
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis-editor-core/lib/style.css';

// 添加自定义样式确保编辑器占满全屏
const style = document.createElement('style');
style.textContent = `
  .full-editor {
    height: 100vh !important;
    width: 100% !important;
    overflow: hidden;
  }
  .full-editor .ae-Editor {
    height: 100% !important;
  }
`;
document.head.appendChild(style);

// 配置
const DEBUG = process.env.NODE_ENV === 'development';

// 初始化 schema
let currentSchema = {
  type: 'page',
  title: '示例页面',
  body: {
    type: 'tpl',
    tpl: '欢迎使用 amis 可视化编辑器！点击左侧添加组件'
  }
};

class AMISEditor extends React.Component {
  state = {
    schema: currentSchema
  };

  handleChange = (value) => {
    currentSchema = value;
    this.setState({ schema: value });
  };

  handleSave = () => {
    // 开发环境下输出到控制台
    if (DEBUG) {
      console.log('='.repeat(50));
      console.log('保存的 Schema JSON:');
      console.log(JSON.stringify(currentSchema, null, 2));
      console.log('='.repeat(50));
    }
    
    // 提示用户
    const message = DEBUG 
      ? 'Schema 已输出到控制台（按 F12 查看）' 
      : 'Schema 已保存';
    alert(message);
  };

  render() {
    return (
      <Editor
        value={this.state.schema}
        onChange={this.handleChange}
        onSave={this.handleSave}
        theme="cxd"
        preview={false}
        autoFocus={false}
        className="full-editor"
      />
    );
  }
}

// 挂载编辑器
ReactDOM.render(<AMISEditor />, document.getElementById('root'));

