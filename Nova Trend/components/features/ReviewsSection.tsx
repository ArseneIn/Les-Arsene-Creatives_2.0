
import React, { useState, useMemo, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Plus, X, ShieldCheck, Zap, ThumbsUp, CheckCircle, Clock } from 'lucide-react';
import { Review, Product } from '../../types';
import { useAuth } from '../context/AuthContext';

interface ReviewsSectionProps {
  product: Product;
  reviews: Review[];
  onAddReview: (review: Partial<Review>) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ product, reviews, onAddReview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => dist[r.rating - 1]++);

    return {
      avg: (sum / total).toFixed(1),
      count: total,
      distribution: dist.reverse() // 5 star to 1 star
    };
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview({
      rating: newRating,
      title: newTitle,
      comment: newComment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userName: 'Guest User',
      isVerified: false
    });
    setIsModalOpen(false);
    setNewTitle('');
    setNewComment('');

    // Nice internal toast instead of alert
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="mt-20">
      <div className="flex items-center gap-3 mb-12">
        <MessageSquare className="w-6 h-6 text-[#FF8C00]" />
        <h2 className="text-3xl font-black text-black uppercase italic tracking-tight">Technical <span className="text-[#FF8C00]">Feedback</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Summary */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-zinc-50 rounded-[40px] p-10 border border-zinc-100">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-6xl font-black text-black leading-none">{stats.avg}</span>
              <div className="flex flex-col">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(stats.avg)) ? 'fill-[#FF8C00] text-[#FF8C00]' : 'text-zinc-200'} `} />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{stats.count} Verified Reviews</span>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {stats.distribution.map((count, i) => {
                const starLevel = 5 - i;
                const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
                return (
                  <div key={starLevel} className="flex items-center gap-4 group">
                    <span className="text-[10px] font-black text-zinc-400 w-12">{starLevel} Star</span>
                    <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF8C00] transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${percentage}% ` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-900 w-8 text-right">{Math.round(percentage)}%</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 border-2 border-black hover:bg-black hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Write a review
            </button>
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="lg:col-span-8 space-y-8">
          {reviews.length === 0 ? (
            <div className="py-20 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
              <p className="text-zinc-400 font-black uppercase tracking-widest italic">No deployments feedback yet. Be the first.</p>
            </div>
          ) : (
            reviews.filter(r => r.isApproved).map((review) => (
              <div key={review.id} className="bg-white border-b border-zinc-100 pb-10 last:border-0">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center font-black text-white text-xs uppercase">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-black uppercase tracking-tight">{review.userName}</h4>
                      {review.isVerified && (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Verified Deployment</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{review.date}</span>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#FF8C00] text-[#FF8C00]' : 'text-zinc-200'} `} />
                  ))}
                </div>

                <h5 className="text-lg font-black text-black uppercase italic mb-3">{review.title}</h5>
                <p className="text-zinc-500 font-medium leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Moderation Toast */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[300] animate-in slide-in-from-right duration-500">
          <div className="bg-black text-white px-8 py-6 rounded-[32px] shadow-2xl border border-[#FF8C00]/30 flex items-center gap-6">
            <div className="w-12 h-12 bg-[#FF8C00] rounded-2xl flex items-center justify-center text-black">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-sm font-black uppercase italic">Review Logged</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pending automated moderation check.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-4 text-zinc-600 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-black">
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8">
              <h3 className="text-3xl font-black text-black uppercase italic leading-none">Deploy <span className="text-[#FF8C00]">Feedback</span></h3>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Asset Performance Registry</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Overall Rating</label>
                <div className="flex gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star className={`w-8 h-8 ${star <= newRating ? 'fill-[#FF8C00] text-[#FF8C00]' : 'text-zinc-200'} `} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Review Headline</label>
                <input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Summarize your experience..."
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#FF8C00] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Detailed Technical Report</label>
                <textarea
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How is the build quality? Any performance issues?"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm font-bold outline-none focus:border-[#FF8C00] transition-all min-h-[150px]"
                />
              </div>

              <button className="w-full bg-[#FF8C00] text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-orange-900/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                <ShieldCheck className="w-5 h-5 fill-black" /> Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
