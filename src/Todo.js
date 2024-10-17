import React, { useEffect, useState } from 'react';


function Todo() {
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [todos, setTodos] = useState([]);
 const [error, setError] = useState('');
 const [message, setMessage] = useState('');

 //Edit options
 const [editTitle, setEditTitle] = useState('');
 const [editDescription, setEditDescription] = useState('');
 const [editId, setEditId] = useState(-1);

 const apiUrl = "http://localhost:3000"

  const handleSumbit = () => {
    setError("");
    //check inputs
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(apiUrl+'/todos', {
        method: "POST",
        headers: {
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({title, description})
      }).then((res) => {
        if (res.ok) {
          //add item to list
          setTodos([...todos, {title, description}])
          setTitle("");
          setDescription("");
          setMessage("Item added successfully...")
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          //set error
          setError("Unable to create Todo item")
        }
      })
      
    }
  }

  const getItems = () => {
    fetch(apiUrl+"/todos")
    .then((res) => res.json())
    .then((res) => {
      setTodos(res)
    })
  }

  useEffect(() => {
   getItems()
  }, [])
  
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  }

  const handleUpdate = () => {
    setError("");
    //check inputs
    if (editTitle.trim() !== '' && editDescription.trim() !== '') {
      fetch(apiUrl+ "/todos/" +editId, {
        method: "PUT",
        headers: {
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({title : editTitle, description: editDescription })
      }).then((res) => {
        if (res.ok) {
          //Update item to list
          const updatedTodos = todos.map((item) => {
            if (item._id == editId) {
               item.title = editTitle;
               item.description = editDescription;
            }
            return item;
          })
          setTodos(updatedTodos)
          setEditTitle("");
          setEditDescription("");
          setMessage("Item updated successfully...")
          setTimeout(() => {
            setMessage("");
          }, 3000);

          setEditId(-1);

        } else {
          //set error
          setError("Unable to create Todo item")
        }
      })
      
    }
  }

  const handleEditCancel = () => {
    setEditId(-1);
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      fetch(apiUrl+"/todos/"+id, {
        method: "DELETE"
      })
      .then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id)
        setTodos(updatedTodos)
      })
    }
    
    
  }


  return (
  <>
    <div>
     <div className='row bg-success text-light '>
      <h1 className='d-flex justify-content-center'>Todo project with MERN stack</h1>
     </div>

     <div className='row px-4'>
       <h3>Add Item</h3>
       {message && <p className='text-success'>{message}</p>}
       <div className='form-group d-flex gap-2'>
        <input placeholder='Title' onChange={(e) => setTitle(e.target.value)} value={title} className='form-control' type='text' required/>
        <input placeholder='Description' onChange={(e) => setDescription(e.target.value)} value={description} className='form-control' type='text' required/>
        <button className='btn btn-dark' onClick={handleSumbit}>Submit</button>
       </div>
     </div>
     {error && <p className='text-danger'>{error}</p>}
   </div>

   <div className='row px-4'>
     <h3 className='mt-2'>Task</h3>
     <div className='col-md-6'>
     <ul className='list-group'>
      { todos.map((item) =>
          <li key={item._id} className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
          <div className='d-flex flex-column'>
            {
              editId == -1 || editId !== item._id ? <>
                  <span className='fw-bold'>{item.title}</span>
                  <span className=''>{item.description}</span>
              </> : <>
               <div className='form-group d-flex gap-2'>
                  <input placeholder='Title' onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className='form-control' type='text' required/>
                  <input placeholder='Description' onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className='form-control' type='text' required/>
               </div>
              </>
             
            }
            
          </div>
          <div className='d-flex gap-2'>
            { editId == -1 || editId !== item._id ?  <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button> : <button className='btn btn-success' onClick={handleUpdate}>Update</button>}
            
            { editId == -1 || editId !== item._id ?  <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button> 
              : <button onClick={ handleEditCancel} className='btn btn-dark'>Cancel</button>}
          </div>
        </li> 
      )}
     </ul>
     </div>
   </div>
  </>
  )
}

export default Todo;