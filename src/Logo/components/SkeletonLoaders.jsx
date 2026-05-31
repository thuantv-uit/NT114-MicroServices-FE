/**
 * Skeleton components — placeholder khi đang fetch data
 *
 * Dùng:
 *   <SkeletonBoardCard />          → trong BoardList khi isLoading
 *   <SkeletonListRow />            → trong Members, Invitations, Notifications
 *   <SkeletonBoardGrid count={6} /> → 6 cards cùng lúc
 */

import React from 'react';
import '../styles/loading.css';

export const SkeletonBoardCard = () => (
  <div className="skel-board-card">
    <div className="skel-line shimmer" style={{ width: '70%' }} />
    <div className="skel-line-sm shimmer" />

    <div className="skel-board-card__tags">
      <div className="skel-tag shimmer" />
      <div className="skel-tag shimmer" style={{ width: 40 }} />
    </div>

    <div className="skel-progress">
      <div className="skel-progress-fill shimmer" />
    </div>

    <div className="skel-board-card__footer">
      <div className="skel-avatar shimmer" style={{ width: 26, height: 26 }} />
      <div className="skel-avatar shimmer" style={{ width: 26, height: 26 }} />
      <div className="skel-line-xs shimmer" style={{ marginLeft: 'auto' }} />
    </div>
  </div>
);

export const SkeletonListRow = () => (
  <div className="skel-list-row">
    <div className="skel-avatar shimmer" style={{ width: 32, height: 32, flexShrink: 0 }} />
    <div className="skel-list-row__info">
      <div className="skel-line shimmer" style={{ width: '50%' }} />
      <div className="skel-line-xs shimmer" />
    </div>
    <div className="skel-tag shimmer" style={{ width: 56, height: 22 }} />
  </div>
);

export const SkeletonBoardGrid = ({ count = 6 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonBoardCard key={i} />
    ))}
  </div>
);

export const SkeletonList = ({ count = 5 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonListRow key={i} />
    ))}
  </div>
);
