export const LibraryServices = () => {
    return (
        // my-5 is verticla top and bottom margin , p-4 padding on all side
        // shodow makes it come up
        // col-lg-7 lg is large screen 7 cols 
        // bootstrap is mobile based col- by default so by default it gets stacked uop each div

        <div className='container my-5'>
            <div className='row p-4 align-items-center border shadow-lg rounded'>
                <div className='col-lg-7 col-6 col-md-6 p-3'>
                    <h1 className='display-5 fw-bold'>
                        Can't find what you are looking for?
                    </h1>
                    <p className='lead'>
                        If you cannot find what you are looking for,
                        send our library admin's a personal message!
                    </p>
                    <div className='d-grid gap-2 justify-content-md-start mb-4 mb-lg-3'>
                        <a className='btn main-color btn-lg text-white' href='#'>
                            Sign up
                        </a>
                    </div>
                </div>
                <div className='col-lg-4 col-md-6 col-6 offset-lg-1 shadow-lg lost-image'></div>
            </div>
        </div>
    );
}