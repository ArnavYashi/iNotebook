import React, { useContext } from 'react'
import noteContext from '../context/notes/NoteContext';

const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { note, updatenote } = props;
    const { deleteNote } = context;
    return (
        <div className='col-md-3'>
            <div className="card my-3" >
                <div className="card-body">
                    <div className="d-flex align-items-center">

                        <h5 className="card-title">{note.title}</h5>
                        <i className="fa-regular fa-trash-can mx-2" onClick={()=>{
                            deleteNote(note._id);
                            props.showAlert("Deleted successfully","success");
                            }}>
                            </i>
                        <i className="fa-regular fa-pen-to-square mx-2" onClick={()=>{updatenote(note);}}></i>
                    </div>

                    <p className="card-text">{note.description}</p>

                </div>
            </div>
        </div>
    )
}

export default Noteitem
