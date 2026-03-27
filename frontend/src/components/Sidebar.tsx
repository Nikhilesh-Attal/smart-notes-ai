import { Link } from 'react-router-dom';

export default function Sidebar(){
  return(
    <aside className='sidebar'>
      <h2>Dashboard</h2>

      <button className='new-btn'>New Note</button>

      <div className='history'>
        {/*here map over database chats*/}
        <p>Machine Learning.pdf</p>
        <p>Research Pager.docx</p>
      </div>

      <div className="sidebar-footer" style={{marginTop: 'auto', borderTop: '1px solid black', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
         <Link to="/">Home</Link>
         <Link to= "/about">About Us</Link>
        </div>
    </aside>
  )
}