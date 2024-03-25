import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import Dropdown from 'react-bootstrap/Dropdown'
import QRCode from "react-qr-code"

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleClick = () => {
    logout()
    navigate("/log_in")
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }



  return (
    <header className="justify-content-space-between">
      <div className='row-sm-6'>
        <div className='container'>
          <Link to="/">
            <h1>Poll</h1>
          </Link>
        </div>
        <div className='navbar'>
          <div className="qr-code-container">
              {user && (
                <div style={{ background: 'white', padding: '8px'}}>
                  <QRCode value={`${window.location.origin}/` + user.username + "/waiting"} size={128}/>
                </div>
              )}  
          </div>
        </div>
      </div>
      <div className='row-sm-6'>
        <div className='col-sm-3'>
          <nav className='menuNav'>
            {user && (
              <div>
                <Dropdown>
                    <Dropdown.Toggle id="mainMenu" variant="btn filter-by dropdown-toggle">
                        Menu
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleDashboard}>Dashboard</Dropdown.Item>
                        <Dropdown.Item onClick={handleClick}>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
            {!user && (
              <div>
                <Link to ="/log_in">Login</Link>
                <Link to ="/sign_up">Signup</Link>
              </div>
            )
            }
          </nav>
        </div>
      </div>
      <div className='row-sm-6'>
        
      </div>
    </header>
  )
}

export default Navbar