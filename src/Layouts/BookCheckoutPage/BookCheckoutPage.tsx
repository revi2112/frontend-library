import { useEffect, useState } from "react"
import BookModel from "../../Models/BookModel"
import { Spinner } from "react-bootstrap";
import { StarsReview } from "../Utils/StarReview";
import { CheckoutAndReviewBox } from "./CheckoutReviewBox";
import ReviewModel from "../../Models/ReviewModel";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {
    // from url get the path param which is book id
    // display will be the book , review , review details, book status and stuff

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true); //loading screen
    const [httpError, setHttpError] = useState(null);   // http error

    //Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [ totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true); //loading screen

    //for path param
    // as param changes the view changes so useEffect
    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {

        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            // const responseData = responseJson._embedded.books;// in /book we get data inside the embedded in /id just the book 

            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };


            setBook(loadedBook);
            setIsLoading(false);
        };

        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [])

    useEffect(() => {
        const  fetchReview = async () =>{
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReview = await fetch(reviewUrl);
            if(!responseReview.ok){
                throw new Error('Review Fetch went wrong');
            }

            const responseJsonReviews = await responseReview.json();
            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews : ReviewModel[] = []
            let stars: number = 0;

            for(const key in responseData){
                loadedReviews.push({
                    id: responseJsonReviews[key].id,
                    userEmail: responseJsonReviews[key].userEmail,
                    date: responseJsonReviews[key].date,
                    rating: responseJsonReviews[key].rating,
                    bookId: responseJsonReviews[key].bookId,
                    reviewDescription: responseJsonReviews[key].reviewDescription
                });

                stars = stars + responseJsonReviews[key].rating
            }


            if(loadedReviews) {

                const round = (Math.round((stars / loadedReviews.length) * 2) /2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchReview().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, []);

    if (isLoading || isLoadingReview) {
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
    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>

                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={4.5} size={32}/>
                        </div>

                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false}/>
                    <LatestReviews reviews= {reviews} bookId={book?.id} mobile={false}/>

                </div>
                <hr />
            </div>
            {/* /* mobile */}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>

                <div className="mt-4">
                    <div className="ml-2">
                    <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={4.5} size={32}/>

                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true}/>

                <hr/>
                <LatestReviews reviews= {reviews} bookId={book?.id} mobile={true}/>

            </div>

            {/* <div className="container mt-5">
                <div className="row align-items-start">

                    <div className="col-12 col-lg-3 mb-4 mb-lg-0">
                        <img
                            src={book?.img || require('./../../Images/BooksImages/book-luv2code-1000.png')}
                            width="226"
                            height="349"
                            alt="Book"
                        />
                    </div>
                    <div className="d-none d-lg-block col-lg-1"></div>
                    <div className="col-12 col-lg-7">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                    </div>

                </div>
                <hr />
            </div> */}



        </div>

    )
}

function async() {
    throw new Error("Function not implemented.");
}
