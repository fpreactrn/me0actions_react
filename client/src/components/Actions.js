import React, { useState, useContext, useEffect } from 'react';
import { CredentialsContext } from '../App';
import { v4 as uuidv4 } from 'uuid';

export default function Actions() {
  const [ actions, setActions ] = useState([]);
  const [ actionText, setActionText ] =useState("");
  const [ credentials ] = useContext(CredentialsContext);
  const [ filter, setFilter ] = useState("uncompleted");
  // const [ error, setError ] = useState("");
  const [ addEdit, setAddEdit ] = useState('add');
  const [ actionId, setActionId ] = useState('');

  const addAction = (e, id) => {
    e.preventDefault();
    if (!actionText) return;
    if (addEdit==='add') {
      const newAction = { id: uuidv4(), text: actionText, checked: false, deleted: false };
      const newActions = [...actions, newAction];
      setActions(newActions);
      setActionText("");
      persist(newActions);
    } else {
      const newActions = [...actions];
      const actionItem = newActions.find((action) => action.id === actionId);
      actionItem.text = actionText;
      setActions(newActions);
      setActionText("");
      persist(newActions);
    };
    setAddEdit('add');
    setActionId('');
  }

  const toggleAction = (id) => {
    const newActions = [...actions];
    const actionItem = newActions.find((action) => action.id === id);
    actionItem.checked = !actionItem.checked
    setActions(newActions);
    persist(newActions);
    console.log(JSON.stringify(actions));
  };  
  
  const deleteAction = (id) => {
    const newActions = [...actions];
    const actionItem = newActions.find((action) => action.id === id);
    actionItem.deleted = !actionItem.deleted
    setActions(newActions);
    persist(newActions);
    console.log(JSON.stringify(actions));
  };

  const displayAction = (id) => {
    const newActions = [...actions];
    const actionItem = newActions.find((action) => action.id === id);
    setActionText(actionItem.text);
    setAddEdit('edit');
    setActionId(actionItem.id)
  };

  const getActions = () => {
    return actions.filter((action) => 
      filter === 'completed' ? action.checked : !action.checked
    );
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const persist = (newActions) => {
    fetch('/actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials.username}:${credentials.password}`
      },
      body: JSON.stringify(newActions)
    })
  };

  useEffect(() => {
    fetch('/actions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials.username}:${credentials.password}`
      },
    })
    .then(response=>response.json())
    .then(actions => setActions(actions))
  },[]);
  
  return (
    <div>
      <form onSubmit={addAction}>
        <div className="form-group">
          <input 
            className="form-control"
            placeholder="Please enter your new action item here..."
            onChange={(e)=>setActionText(e.target.value)}
            value={actionText}
          />
        </div>
        <br />

        <div className="d-flex jsutify-content-between align-item-end">
          <button type="submit" className="btn btn-info btn-md">Save</button> 
        </div>       
      </form>
      <br />

      <select onChange={(e)=>changeFilter(e.target.value)}>
        <option value="uncompleted">Uncompleted Item</option>
        <option value="completed">Completed Item</option>
      </select>
      <br />

      <div className="mt-3">
        <table className="table table-strip mt-3">
          <thead>
            <tr style={{width: '100%'}}>
              <th style={{width: '70%'}}>Action Item Text</th>
              <th style={{width: '15%'}}>Complete</th>
              <th style={{width: '15%'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              getActions().map((action) => (
                !action.deleted &&
                <tr 
                  key={action.id==null?action._id:action.id}
                  className="group-list-item"
                  style={{ textAlign: 'left' }}
                >

                  <td>
                    <span onClick={()=>displayAction(action.id)}>{action.text}</span>
                  </td>

                  <td style={{'text-align':'center', 'vertical-align':'middle', 'horizontal-align':'middle'}}>
                    <input 
                      type="checkbox"
                      onChange={() => {toggleAction(action.id)}}
                      checked={action.checked}
                    />

                  </td>

                  <td>
                    <button 
                      onClick={()=>deleteAction(action.id)}
                      className="btn btn-info btn-mid"
                    >
                      Delete
                    </button>
                  </td>
                </tr> 
              )) 
            }
          </tbody>
        </table>
      </div>      
    </div>    
  );
};