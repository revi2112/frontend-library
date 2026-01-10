import ReviewModel from "../../Models/ReviewModel"
import { StarsReview } from "./StarReview";

export const Review: React.FC<{ review: ReviewModel, key: number }> = (props) => {
    // props.review.dateis usually a string
    //Date object so JS can work with it (new date) "2025-01-12T10:30:00Z" → Date object
    const dateRender = new Date(props.review.date)
  .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <>
            <div>
                <div className='col-sm-8 col-md-8'>
                    <h5>{props.review.userEmail}</h5>
                    <div className='row'>
                        <div className='col'>
                            {dateRender}
                        </div>
                        <div className='col'>
                            <StarsReview rating={props.review.rating} size={16} />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <p>
                            {props.review.reviewDescription}
                        </p>
                    </div>
                </div>
                <hr />
            </div>
        </>
    );
}