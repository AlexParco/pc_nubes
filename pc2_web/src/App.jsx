import { useEffect, useState } from 'react'
import './App.css'
import { Button, Modal, Container, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Crear } from './crear';
import { Editar } from './editar';
import {URL} from './utils/config'


function App({setRouter}) {
  const [pacientes, setPacientes] = useState([])

  // modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  
  useEffect(() => {
    fetch(URL + 'pacientes')
    .then(resp => resp.json())
    .then(resp => {
      console.log(resp)
      setPacientes(resp)
    })
    .catch(console.log)
  }, [])


  const handleDelete = (id) => {
    fetch(URL + 'delete/' + id,{
      method: 'DELETE',
    })
    .then(res => {
      setPacientes(prev => prev.filter(e => e._id !== id))
    })
    .catch(console.log)
  }

  return (
    <>
      <Container>
        <div className='d-flex flex-column gap-3 w-100'>
          <Crear setPacientes={setPacientes}/>
          <table className="table" border='1'>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">sexo</th>
                <th scope="col">especialidades</th>
                <th scope="col">Foto</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((value, index) => (
                <tr key={index}>
                  <td>{value._id}</td>
                  <td>{value.nombre}</td>
                  <td>{value.apellido}</td>
                  <td>{value.sexo}</td>
                  <td>
                    {value.especialidad.map((esp, index) => (
                      <p key={index}>{esp}</p>
                    ))}
                  </td>
                  <td><img src={value.image} width={200}/></td>
                  <td>
                    <Editar setPacientes={setPacientes} idPaciente={value._id}
                    />
                    <button className='btn btn-danger' onClick={() => handleDelete(value._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  )
}

export default App
