import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import RoleColorBadge from './RoleColorBadge';
import CandidateDrawer from './CandidateDrawer';
import { Clock } from 'lucide-react';

const getDaysInStage = (dateString) => {
   if (!dateString) return 0;
   const diffTime = Math.abs(new Date() - new Date(dateString));
   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function KanbanBoard({ stages, candidates, onDragEnd }) {
  const [selectedId, setSelectedId] = useState(null);

  const getCandidatesForStage = (stage) => {
    return candidates.filter(c => c.stage === stage);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full min-h-[500px]">
          {stages.map((stage) => {
            const stageCandidates = getCandidatesForStage(stage);
            return (
              <div key={stage} className="flex flex-col w-72 flex-shrink-0 bg-gray-100/50 rounded-xl border border-gray-200">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50/80 rounded-t-xl">
                  <h3 className="font-semibold text-gray-700 text-sm">{stage}</h3>
                  <span className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                    {stageCandidates.length}
                  </span>
                </div>

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''}`}
                    >
                      {stageCandidates.map((cand, index) => (
                        <Draggable key={cand.id} draggableId={cand.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedId(cand.id)}
                              className={`mb-2 p-3 bg-white rounded-lg shadow-sm border ${snapshot.isDragging ? 'border-[#28BCE8] shadow-md' : 'border-gray-200'} hover:border-gray-300 transition-all cursor-pointer`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-gray-900 text-sm truncate pr-2">{cand.name}</div>
                                <RoleColorBadge color={cand.rolecolor} />
                              </div>
                              <div className="text-xs text-gray-500 mb-3 truncate">
                                {cand.jobs?.title || 'General Application'}
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center text-gray-400 gap-1" title="Days in stage">
                                   <Clock size={12} /> {getDaysInStage(cand.created_at)}d
                                </div>
                                <div className="flex items-center gap-1">
                                   <span className="text-gray-400">Score:</span>
                                   <span className={`font-medium ${cand.score >= 80 ? 'text-green-600' : cand.score >= 50 ? 'text-yellow-600' : 'text-gray-600'}`}>
                                     {cand.score || '-'}
                                   </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <CandidateDrawer
         isOpen={!!selectedId}
         onClose={() => setSelectedId(null)}
         candidateId={selectedId}
         onUpdate={() => {}} // Rely on pipeline refetch
      />
    </>
  );
}
