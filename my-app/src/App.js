import React, { Component } from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  IntegratedPaging,
  EditingState,
  SearchState,
  IntegratedFiltering
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableEditRow,
  TableEditColumn,
  Toolbar,
  SearchPanel
} from '@devexpress/dx-react-grid-material-ui';

const getRowId = row => row.id;
const toogleState = () => {
  alert("change State");
}

const HighlightedCell = ({ value, ...restProps }) => (
  <Table.Cell
    {...restProps}
  >
    <input type="radio" checked={value} onChange={()=>{toogleState();}}></input>
  </Table.Cell>
);

const alertHistory = (history)=>{
  let message  = "";
  history.map((h)=>{
    message += "Name: "+ h["row"]["name"]+" Desc:"+h["row"]["desc"]+" Status:"+h["row"]["status"]+"\n";
  });
  alert(message)
}

const Cell = (props) => {
  const { column } = props;
  if (column.name === 'status') {
    return <HighlightedCell {...props} />;
  }
  return <Table.Cell {...props} onClick={()=>{alertHistory(props.row.history)}}/>;
};


class App extends Component {
  constructor(props){
    super(props);
    this.commitChanges = this.commitChanges.bind(this);
  }
  state= {
    columns: [
      { name: 'id', title: 'ID' },
      { name: 'name', title: 'Name' },
      { name: 'desc', title: 'Description' },
      { name: 'status', title: 'Status' }
    ],
    editingColumnExtensions: [
      {
        columnName: 'name',
        createRowChange: (row, value) => {
          return ({ name: value })
        }
      },
      {
        columnName: 'desc',
        createRowChange: (row, value) => ({ desc: value}),
      },
      {
        columnName: 'status',
        createRowChange: (row, value) => ({status: value }),
      },
    ],
    rows: [
      {id: 0, name: 'Abhinav', desc: 'ace seller', status:true, history:[]},
      {id: 1, name: 'Amritesh', desc: 'ace seller', status:true, history:[]},
      {id: 2, name: 'Rajat', desc: 'ace seller', status:true, history:[]},
      {id: 3, name: 'Himanshu', desc: 'ace seller', status:true, history:[]},
      {id: 4, name: 'Sayal', desc: 'ace seller', status:true, history:[]},
    ]
  }
  createNewMerchant = () => {
    let merchant = {
      name: Math.random().toString(36).substring(7),
      desc: Math.random().toString(36).substring(7),
      status: true
    }
    let rows = this.state.rows;
    rows.push(merchant);
    this.setState({rows: [...rows]});
  }
  commitChanges({ added, changed, deleted }) {
    let { rows } = this.state;
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
          history:[]
        })),
      ];
    }
    if (changed) {
      rows = rows.map(row => {
        if(changed[row.id])
          row.history.push({row});
        return changed[row.id] ? { ...row, ...changed[row.id], ...history } : row
      });
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      rows = rows.filter(row => !deletedSet.has(row.id));
    }
    this.setState({ rows });
  }
  render() {
    const {rows, columns, editingColumnExtensions} = this.state;
    return (
      <div className="App">
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
          >
            <SearchState defaultValue="" />
            <IntegratedFiltering />
            <PagingState
              defaultCurrentPage={0}
              pageSize={3}
            />
            <IntegratedPaging />
            <EditingState
              columnExtensions={editingColumnExtensions}
              onCommitChanges={this.commitChanges}
            />
            <Table 
              cellComponent={Cell}
            />
            <TableHeaderRow />
            <TableEditRow />
            <TableEditColumn showAddCommand showEditCommand showDeleteCommand />
            <PagingPanel />
            <Toolbar />
            <SearchPanel />
          </Grid>
        </Paper>
      </div>
      
    );
  }
}

export default App;
