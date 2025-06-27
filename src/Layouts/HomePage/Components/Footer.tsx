export const Footer = () => {
    return (
        <div className='main-color'>
            <footer className='container d-flex flex-wrap 
            justify-content-between align-items-center py-3 main-color navbar-dark'>

                <p className='col-md-4 mb-0 text-white'>© Example Library App, Inc</p>
                <ul className='navbar-nav col-md-4 flex-row justify-content-end'>
                    <li className='nav-item'>
                        <a href='#' className='nav-link px-2 '>
                            Home
                        </a>
                    </li>
                    <li className='nav-item'>
                        <a href='#' className='nav-link px-2'>
                            Search Books
                        </a>
                    </li>
                </ul>
            </footer>
        </div>
    );
}
