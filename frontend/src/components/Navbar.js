import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <header>
      <div className="container">
        <Link to="/dashboard">
          <h1>Poll</h1>
        </Link>
      </div>
    </header>
  )
}

export default Navbar