import { useEffect, useState } from 'react';
import BookModel from '../../Models/BookModel';
import { Container, Row, Col, Form, Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { SearchBook } from './Components/SearchBook';
import { Pagination } from '../Utils/Pagination';

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book Category');

    useEffect(() => {

        const fetchBooks = async () => {
            const baseUrl: string = "http://localhost:8080/api/books";

            let url: string = ``;

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;

            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage-1}`)
                url = baseUrl + searchWithPage;
            }
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const responseData = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages)

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };

        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, searchUrl])

    if (isLoading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" variant="secondary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
        }
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (
            value.toLowerCase() === 'fe' ||
            value.toLowerCase() === 'be' ||
            value.toLowerCase() === 'data' ||
            value.toLowerCase() === 'devops'
        ) {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`)
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`)
        }

        setCategorySelection('Book Category')
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
        booksPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        < div className='container'>
            <div>

                <Row className='mt-5'>
                    <Col md={6}>
                        <Form className='d-flex'>
                            <Form.Control
                                type='search'
                                placeholder='Search'
                                className='me-2'
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Button variant='outline-success' onClick={searchHandleChange}>
                                Search
                            </Button>
                        </Form>
                    </Col>
                    <Col md={4}>
                        <DropdownButton
                            id='dropdown-basic-button'
                            title={categorySelection}
                            variant='secondary'
                        >
                            <Dropdown.Item onClick={() => categoryField('All')}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => categoryField('FE')}>Front End</Dropdown.Item>
                            <Dropdown.Item onClick={() => categoryField('BE')}>Back End</Dropdown.Item>
                            <Dropdown.Item onClick={() => categoryField('Data')}>Data</Dropdown.Item>
                            <Dropdown.Item onClick={() => categoryField('DevOps')}>DevOps</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                {totalAmountOfBooks > 0 ?
                    <>
                        <div className='mt-3'>
                            <h5>Number of results: ({totalAmountOfBooks})</h5>
                        </div>
                        <p>
                            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                        </p>
                        {books.map(book => (
                            <SearchBook book={book} key={book.id} />
                        ))}
                    </>
                    :
                    <div className='m-5'>
                        <h3>
                            Can't find what you are looking for?
                        </h3>
                        <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                            href='#'>Library Services</a>
                    </div>
                }

                {/* render only if totalpage > 1 */}
                {totalPages > 1 &&
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                }
            </div>

        </div>
    )
}