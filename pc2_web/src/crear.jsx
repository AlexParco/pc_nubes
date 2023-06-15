import { useEffect, useState } from 'react'
import { Button, Modal, Container, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export const Crear = ({
  setPacientes
}) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [file, setFile] = useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApelldio] = useState("")
  const [sexo, setSexo] = useState("")
  const [especialidad, setEspecialidad] = useState("")

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('files', file)
    console.log({
      nombre,
      apellido,
      especialidad,
      sexo
    })
    fetch('/upload',{
      method: 'POST',
      body: formData
    })
    .then(resp => resp.json())
    .then(res  => {
      fetch('/register',{
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          apellido,
          nombre,
          sexo,
          especialidad: especialidad.split(","),
          image: res.image
        })
      })
      .then(resp => resp.json())
      .then(res => {
        toggle()
        setPacientes(prev => [...prev, res])
      })
    }) 
  }

  return ( 
    <>
      <Button color="primary w-25" onClick={toggle}>Agregar</Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Agregar Paciente</ModalHeader>
        <ModalBody>
          <form className='d-flex gap-4 flex-column my-4'>
            <input value={nombre} required onChange={e => setNombre(e.target.value)} className="form-control" type="text" placeholder="Nombre" aria-label="nombre" />
            <input value={apellido} required onChange={e => setApelldio(e.target.value)} className="form-control" type="text" placeholder="apellido" aria-label="apellido" />
            <input value={sexo} required onChange={e => setSexo(e.target.value)}  className="form-control" type="text" placeholder="sexo" aria-label="sexo" />
            <input value={especialidad} required onChange={e => setEspecialidad(e.target.value)}  className="form-control" type="text" placeholder="especialidad 1, especialidad2" aria-label="especialidad" />
            <div className="mb-3">
              <input className="form-control" required onChange={(e) => setFile(e.target.files[0])} 
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