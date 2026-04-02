# Drag and Drop Integration Instructions for SettlementChecklistManager.tsx

## Step 1: Add imports at the top of the file (after line 43)
```typescript
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableTaskItem } from './DraggableTaskItem';
```

## Step 2: Add moveTask function after handleAIAutoAssign (around line 185)
```typescript
  const moveTask = (dragIndex: number, hoverIndex: number, dragCategory: string, hoverCategory: string) => {
    const dragTask = tasks.filter(t => t.category === dragCategory)[dragIndex];
    
    // Remove task from old position
    const filteredTasks = tasks.filter(t => t.id !== dragTask.id);
    
    // Update category if moved to different category
    const updatedTask = dragCategory !== hoverCategory 
      ? { ...dragTask, category: hoverCategory as any }
      : dragTask;
    
    // Get tasks in target category
    const targetCategoryTasks = filteredTasks.filter(t => t.category === hoverCategory);
    const otherTasks = filteredTasks.filter(t => t.category !== hoverCategory);
    
    // Insert at new position
    targetCategoryTasks.splice(hoverIndex, 0, updatedTask);
    
    // Combine all tasks
    const newTasks = [...otherTasks, ...targetCategoryTasks];
    
    setTasks(newTasks);
    
    toast.success('Task moved', {
      description: dragCategory !== hoverCategory ? `Moved to ${hoverCategory}` : 'Reordered'
    });
  };
```

## Step 3: Wrap the entire return statement in DndProvider (line 187)
Replace:
```typescript
  return (
    <div className="space-y-6">
```

With:
```typescript
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
```

## Step 4: Close the DndProvider at the end of return (find the closing </div> for space-y-6)
Add `</DndProvider>` before the final closing parenthesis and semicolon

## Step 5: Update the task rendering (around line 398)
Replace:
```typescript
{categoryTasks.map(task => (
  <TaskItem
    key={task.id}
    task={task}
    onToggle={() => toggleTaskStatus(task.id)}
    onUpdate={(updatedTask) => {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    }}
  />
))}
```

With:
```typescript
{categoryTasks.map((task, index) => (
  <DraggableTaskItem
    key={task.id}
    id={task.id}
    index={index}
    category={category.id}
    moveTask={moveTask}
  >
    <TaskItem
      task={task}
      onToggle={() => toggleTaskStatus(task.id)}
      onUpdate={(updatedTask) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      }}
    />
  </DraggableTaskItem>
))}
```

---

## Summary of Changes:
1. Import drag and drop libraries
2. Add moveTask function to handle reordering
3. Wrap component in DndProvider
4. Wrap each TaskItem in DraggableTaskItem wrapper

## Features Added:
- ✅ Drag tasks within the same category to reorder
- ✅ Drag tasks to different categories to recategorize
- ✅ Visual grip handle appears on hover
- ✅ Toast notifications on move
- ✅ Smooth drag animations
- ✅ Half-height hover detection for precise placement
