import { useEffect, useState } from 'react';
import BookModel from '../../Models/BookModel';
import { Container, Row, Col, Form, Button, Dropdown, DropdownButton, Spinner } from 'react-bootstrap';
import { SearchBook } from './Components/SearchBook';
import { Pagination } from '../Utils/Pagination';
import { title } from 'process';

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book Category');
    const [searchcategorySelection, setSearchCategorySelection] = useState('Search By');
    const [searchFieldType, setSearchFieldType] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('');


    useEffect(() => {

        const fetchBooks = async () => {
            console.log("useEffect fired :", search, "category:", selectedCategory, "file:", searchFieldType,  "Page:", currentPage);
            const baseUrl: string = "http://localhost:8080/api/books";


            let url: string = ``;
            const searchTrimmed = search.trim();
            const categoryTrimmed = selectedCategory.trim().toLowerCase();
            // if (searchUrl === '') {
            //     url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;

            // } else {
            //     let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`)
            //     url = baseUrl + searchWithPage;
            // }
            
            if (!searchTrimmed && !categoryTrimmed) {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else if (searchTrimmed && categoryTrimmed) {
                if (searchFieldType === 'title') {
                    url = `${baseUrl}/search/findByCategoryAndTitleContaining?category=${categoryTrimmed}&title=${searchTrimmed}&page=${currentPage -1}&size=${booksPerPage}`;
                } else if (searchFieldType === 'author') {
                    url = `${baseUrl}/search/findByCategoryAndAuthorContaining?category=${categoryTrimmed}&author=${searchTrimmed}&page=${currentPage - 1}&size=${booksPerPage}`;
                }
            } else if (categoryTrimmed) {
                url = `${baseUrl}/search/findByCategory?category=${categoryTrimmed}&page=${currentPage -1 }&size=${booksPerPage}`;
            } else if (searchTrimmed) {
                if (searchFieldType === 'title') {
                    url = `${baseUrl}/search/findByTitleContaining?title=${searchTrimmed}&page=${currentPage - 1}&size=${booksPerPage}`;
                } else if (searchFieldType === 'author') {
                    url = `${baseUrl}/search/findByAuthorContaining?author=${searchTrimmed}&page=${currentPage - 1}&size=${booksPerPage}`;
                }
            }
    
            console.log("Final URL:", url);

            
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
            console.log("books", loadedBooks);
            setBooks(loadedBooks);
            setIsLoading(false);
        };

        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage,search, categorySelection, searchFieldType])

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
    // we are uisng value in url brecause setsate is async and so is api call
    //…the searchUrl is being set before search actually updates.

    const searchHandleChange = (value: string) => {
        setSearch(value);
        console.log("value", search)
        console.log("fiels", searchFieldType)
        setCurrentPage(1);
        // if (value.trim() === '') {
        //     setSearchUrl('');
        // }else {
        //     if (searchFieldType === 'title') {
        //         console.log("hi title")
        //         setSearchUrl(`/search/findByTitleContaining?title=${value}&page=<pageNumber>&size=${booksPerPage}`);
        //     } else if (searchFieldType === 'author') {
        //         console.log("hi author")
        //         setSearchUrl(`/search/findByAuthorContaining?author=${value}&page=<pageNumber>&size=${booksPerPage}`);
        //     }
        // } 
        // else {
        //     setSearchUrl(`/search/findByTitleContaining?title=${value}&page=<pageNumber>&size=${booksPerPage}`)
        // }
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        console.log("filed act", value, "seach", search)
        setSelectedCategory(value);
        setCategorySelection(value);

    }

    const searchField = (value: string) => {
        setCurrentPage(1);
        setSearch('');
        setSearchFieldType(value.toLowerCase());
        setSearchCategorySelection("Searching by " + value);
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
                    <Col md={2}>
                        <DropdownButton
                            id='dropdown-basic-button'
                            title={searchcategorySelection}
                            variant='secondary'
                        >
                            <Dropdown.Item onClick={() => searchField('All')}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => searchField('Title')}>Title</Dropdown.Item>
                            <Dropdown.Item onClick={() => searchField('Author')}>Author</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col md={4}>
                        <Form>
                            <Form.Control
                                type='search'
                                placeholder={`Search by ${searchFieldType.charAt(0).toUpperCase() + searchFieldType.slice(1)}`}
                                className='me-2'
                                value={search}
                                onChange={e => searchHandleChange(e.target.value)}
                            />
                            {/* <Button variant='outline-success' onClick={searchHandleChange}>
                                Search
                            </Button> */}
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