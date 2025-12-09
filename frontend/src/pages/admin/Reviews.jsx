import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, AlertOctagon } from 'lucide-react';

const Reviews = () => {
  // TODO: Backend Integration - Fetch reviews from API
  // useEffect(() => {
  //   fetchReviews().then(data => setReviews(data));
  // }, []);

  const [reviews, setReviews] = useState([
    { id: 1, user: 'Nguyen Van A', service: 'Luxury King Room', rating: 5, comment: 'Dịch vụ tuyệt vời, phòng sạch sẽ.', status: 'Approved', date: '2023-12-08' },
    { id: 2, user: 'Tran Thi B', service: 'City Tour', rating: 2, comment: 'Hướng dẫn viên đến trễ.', status: 'Pending', date: '2023-12-07' },
    { id: 3, user: 'Unknown User', service: 'Spa Package', rating: 1, comment: 'SPAM SPAM SPAM...', status: 'Spam', date: '2023-12-06' },
  ]);

  const handleApprove = (id) => {
    // TODO: Backend Integration - Approve review
    // await approveReviewAPI(id);
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleHide = (id) => {
    // TODO: Backend Integration - Hide/Reject review
    // await rejectReviewAPI(id);
    // For demo, we just set status to 'Hidden' or remove it. Let's set to Hidden
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Hidden' } : r));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Quản lý đánh giá</h2>

      <div className="grid grid-cols-1 gap-4">
        {reviews.filter(r => r.status !== 'Hidden').map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-bold text-gray-900">{review.user}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">{review.service}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">"{review.comment}"</p>
            </div>

            <div className="flex flex-row md:flex-col justify-center items-end space-x-2 md:space-x-0 md:space-y-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4 min-w-[140px]">
              {review.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center space-x-2 w-full justify-center px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    <CheckCircle size={16} />
                    <span>Duyệt</span>
                  </button>
                  <button
                    onClick={() => handleHide(review.id)}
                    className="flex items-center space-x-2 w-full justify-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                  >
                    <XCircle size={16} />
                    <span>Ẩn</span>
                  </button>
                </>
              )}
              {review.status === 'Approved' && (
                <div className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle size={16} className="mr-2" /> Đã duyệt
                </div>
              )}
              {review.status === 'Spam' && (
                <div className="flex items-center text-red-600 text-sm font-bold bg-red-50 px-3 py-1 rounded-full">
                  <AlertOctagon size={16} className="mr-2" /> Spam
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
