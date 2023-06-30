import { useEffect, useState } from 'react'
import { Button, Modal, Container, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {URL} from './utils/config'

export const Editar = ({
  setPacientes,
  idPaciente,
}) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [file, setFile] = useState(null)
  const [nombre, setNombre] = useState("")
  const [apellido, setApelldio] = useState("")
  const [sexo, setSexo] = useState("")
  const [especialidad, setEspecialidad] = useState("")
  const [image, setImage] = useState(null)
  const [oldImageUrl, setOldImageUrl] = useState("")

  const findData = () => {
    if(idPaciente === "") return
    fetch('/paciente/'+idPaciente)
    .then(res => res.json())
    .then(res => {
      setNombre(res.nombre)
      setApelldio(res.apellido)
      setSexo(res.sexo)
      console.log(res.especialidad)
      setEspecialidad(res.especialidad)
      setOldImageUrl(res.image)
    })
    .catch(console.log)
  }

  const handleSubmit = () => {
    const formData = new FormData()
    if(file !== null) {
      fetch(URL + 'upload',{
        method: 'POST',
        body: formData
      })
      .then(resp => resp.json())
      .then(res  => {
        setImage(res.image)
      }) 
    } 
    console.log({
      apellido,
      nombre,
      sexo,
      especialidad: especialidad.split(","),
      image: image ? image : oldImageUrl 
    }, 'update edit')
    fetch(URL + 'update/' + idPaciente, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        apellido,
        nombre,
        sexo,
        especialidad: especialidad.split(","),
        image: image ? image : oldImageUrl 
      })
    })
    .then(resp => resp.json())
    .then(res => {
      toggle()
      setPacientes(prev => prev.map(e => {
        if(e._id === idPaciente) {
          e = res
        }
        return e
      }))
    })
  }

  return (
    <>
      <Button color="primary mx-3" onClick={() => {
        toggle()
        findData()
      }}>Editar</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Editar Paciente</ModalHeader>
        <ModalBody>
          <form className='d-flex gap-4 flex-column my-4'>
            <input value={nombre} onChange={e => setNombre(e.target.value)} className="form-control" type="text" placeholder="Nombre" aria-label="nombre" />
            <input value={apellido} onChange={e => setApelldio(e.target.value)} className="form-control" type="text" placeholder="apellido" aria-label="apellido" />
            <input value={sexo} onChange={e => setSexo(e.target.value)}  className="form-control" type="text" placeholder="sexo" aria-label="sexo" />
            <input value={especialidad} onChange={e => setEspecialidad(e.target.value)}  className="form-control" type="text" placeholder="especialidad 1, especialidad2" aria-label="especialidad" />
            <div className="mb-3">
              <input className="form-control" onChange={(e) => setFile(e.target.files[0])} 
              type="file" id="formFile"/>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            save
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}