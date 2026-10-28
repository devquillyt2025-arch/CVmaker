'use client';

import { useResumeStore } from '@/lib/store/useResumeStore';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import MonthYearPicker from '@/components/builder/MonthYearPicker';

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{children}</p>;
}

export default function ProjectsStep({ headless = false }: { headless?: boolean }) {
  const projects = useResumeStore((state) => state.data.projects || []);
  const { addProject, updateProject, removeProject, reorderProjects } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderProjects(result.source.index, result.destination.index);
  };

  const inputCls =
    'w-full rounded-[8px] border border-[#E2E8F0] bg-white px-[14px] py-[10px] text-[14px] text-slate-900 transition-colors duration-150 placeholder:text-slate-400 focus:border-[var(--accent-color)] focus:ring-[3px] focus:ring-[var(--accent-ring)] focus:outline-none';

  return (
    <div className="space-y-5">
      {!headless && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            <p className="text-sm text-gray-500 mt-1">
              Highlight personal or professional projects that showcase your skills.
            </p>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {projects.map((project, index) => {
                const isExpanded = expandedId === project.id;
                return (
                  <Draggable key={project.id} draggableId={project.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`rounded-xl border overflow-hidden transition-all ${
                          snapshot.isDragging ? 'shadow-lg border-indigo-300' : 'border-gray-200 shadow-sm'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50 border-b border-gray-200' : 'bg-white'}`}
                          onClick={() => setExpandedId(isExpanded ? null : project.id)}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {project.name || '(Project not specified)'}
                            </h3>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {project.startDate || 'Start'} – {project.endDate || 'End'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mr-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="text-gray-400">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="divide-y divide-slate-100 bg-white">
                            {/* ─ Project Details ─ */}
                            <div className="px-4 py-4 space-y-3">
                              <GroupLabel>Project Details</GroupLabel>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Project Name</label>
                                  <input
                                    type="text"
                                    value={project.name}
                                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                    className={inputCls}
                                    placeholder="e.g. E-Commerce Dashboard"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Project Link / URL</label>
                                  <input
                                    type="text"
                                    value={project.url}
                                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                                    className={inputCls}
                                    placeholder="e.g. github.com/my-project"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* ─ Duration ─ */}
                            <div className="px-4 py-4 space-y-3">
                              <GroupLabel>Duration</GroupLabel>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Date</label>
                                  <MonthYearPicker
                                    value={project.startDate}
                                    onChange={(v) => updateProject(project.id, { startDate: v })}
                                    placeholder="Start date"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1.5">End Date</label>
                                  <MonthYearPicker
                                    value={project.endDate}
                                    onChange={(v) => updateProject(project.id, { endDate: v })}
                                    placeholder="End date"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* ─ Description ─ */}
                            <div className="px-4 py-4 space-y-3">
                              <GroupLabel>Description</GroupLabel>
                              <textarea
                                value={project.description}
                                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                className="w-full min-h-[120px] rounded-[8px] border border-[#E2E8F0] bg-white px-[14px] py-[10px] text-[14px] text-slate-900 transition-colors duration-150 placeholder:text-slate-400 focus:border-[var(--accent-color)] focus:ring-[3px] focus:ring-[var(--accent-ring)] focus:outline-none resize-none"
                                placeholder={"• Built with React and Node.js...\n• Achieved 10k daily active users..."}
                              />
                              <p className="text-[11px] text-gray-400">One bullet per line. Quantify impact where possible.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {projects.length === 0 && (
        <p className="text-[13px] text-gray-400 italic text-center py-4">No entries yet.</p>
      )}
      <button
        onClick={() => {
          addProject();
          setTimeout(() => {
            const list = useResumeStore.getState().data.projects || [];
            if (list.length > 0) setExpandedId(list[list.length - 1].id);
          }, 0);
        }}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-violet-700 border border-dashed border-violet-300 rounded-[10px] bg-transparent hover:bg-violet-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </button>
    </div>
  );
}
