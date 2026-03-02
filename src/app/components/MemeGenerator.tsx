'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { TextBox, MemeTemplate } from '@/types/meme';

// Placeholder templates - user will provide these
const TEMPLATES: MemeTemplate[] = [
    { id: '1', name: 'Template 1', image: '/memes/template1.png', width: 600, height: 600 },
    { id: '2', name: 'Template 2', image: '/memes/template2.png', width: 600, height: 600 },
    { id: '3', name: 'Template 3', image: '/memes/template3.png', width: 600, height: 600 },
    { id: '4', name: 'Template 4', image: '/memes/template4.png', width: 600, height: 600 },
    { id: '5', name: 'Template 5', image: '/memes/template5.png', width: 600, height: 600 },
    { id: '6', name: 'Template 6', image: '/memes/template6.png', width: 600, height: 600 },
    { id: '7', name: 'Template 7', image: '/memes/template7.png', width: 600, height: 600 },
    { id: '8', name: 'Template 8', image: '/memes/template8.png', width: 600, height: 600 },
    { id: '9', name: 'Template 9', image: '/memes/template9.png', width: 600, height: 600 },
    { id: '10', name: 'Template 10', image: '/memes/template10.png', width: 600, height: 600 },
];

export default function MemeGenerator() {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('1');
    const [textBoxes, setTextBoxes] = useState<TextBox[]>([
        { id: '1', text: 'Top Text', x: 50, y: 30, fontSize: 42, color: '#FFFFFF', fontFamily: 'Arial', isBold: true, isItalic: false, maxWidth: 500 },
        { id: '2', text: 'Middle Text', x: 150, y: 260, fontSize: 48, color: '#FFFFFF', fontFamily: 'Arial', isBold: true, isItalic: false, maxWidth: 300 },
        { id: '3', text: 'Bottom Text', x: 50, y: 530, fontSize: 42, color: '#FFFFFF', fontFamily: 'Arial', isBold: true, isItalic: false, maxWidth: 500 },
    ]);
    const [selectedBoxId, setSelectedBoxId] = useState<string | null>('2');
    const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; startBoxX: number; startBoxY: number } | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
    const selectedBox = textBoxes.find((box) => box.id === selectedBoxId);

    const updateTextBox = (id: string, updates: Partial<TextBox>) => {
        setTextBoxes(textBoxes.map((box) => (box.id === id ? { ...box, ...updates } : box)));
    };

    const addTextBox = () => {
        const newBox: TextBox = {
            id: Date.now().toString(),
            text: 'New Text',
            x: 100,
            y: 100,
            fontSize: 32,
            color: '#FFFFFF',
            fontFamily: 'Arial',
            isBold: true,
            isItalic: false,
            maxWidth: 400,
        };
        setTextBoxes([...textBoxes, newBox]);
        setSelectedBoxId(newBox.id);
    };

    const removeTextBox = (id: string) => {
        setTextBoxes(textBoxes.filter((box) => box.id !== id));
        setSelectedBoxId(textBoxes[0]?.id || null);
    };

    const downloadMeme = async () => {
        if (!canvasRef.current) return;

        try {
            const canvas = await html2canvas(canvasRef.current, {
                backgroundColor: null,
                scale: 2,
                allowTaint: true,
                useCORS: true,
                logging: true,
                imageTimeout: 3000,
            });

            // Use canvas.toDataURL as fallback
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `genmeme-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to download meme:', error);
            alert('Failed to download meme. Try refreshing the page and try again.');
        }
    };

    const handleMouseDown = (e: React.MouseEvent, boxId: string) => {
        setSelectedBoxId(boxId);
        const box = textBoxes.find((b) => b.id === boxId);
        if (!box) return;

        setDragging({
            id: boxId,
            startX: e.clientX,
            startY: e.clientY,
            startBoxX: box.x,
            startBoxY: box.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging) return;

        const deltaX = e.clientX - dragging.startX;
        const deltaY = e.clientY - dragging.startY;

        updateTextBox(dragging.id, {
            x: Math.max(0, Math.min(dragging.startBoxX + deltaX, 500)),
            y: Math.max(0, Math.min(dragging.startBoxY + deltaY, 550)),
        });
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    return (
        <div className="min-h-screen bg-purple-100 text-black p-6">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <img src="/logo.jpg" alt="GenMeme Logo" className="w-12 h-12" />
                    <h1 className="text-5xl font-bold" style={{ fontFamily: '"Fredoka One", cursive' }}>
                        [Gen-meme]
                    </h1>
                </div>
                <p className="text-gray-600">Create fun memes instantly</p>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Canvas */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                        <div
                            ref={canvasRef}
                            className="relative inline-block mx-auto bg-black rounded overflow-hidden"
                            style={{ width: currentTemplate.width, height: currentTemplate.height }}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {/* Template Image */}
                            <img
                                src={currentTemplate.image}
                                alt={currentTemplate.name}
                                className="w-full h-full rounded absolute inset-0"
                                draggable={false}
                            />

                            {/* Text Boxes */}
                            {textBoxes.map((box) => (
                                <div
                                    key={box.id}
                                    className={`absolute cursor-move p-2 rounded select-none ${
                                        selectedBoxId === box.id ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-500'
                                    }`}
                                    style={{
                                        left: `${box.x}px`,
                                        top: `${box.y}px`,
                                        maxWidth: `${box.maxWidth}px`,
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e, box.id)}
                                    onClick={() => setSelectedBoxId(box.id)}
                                >
                                    <div
                                        style={{
                                            fontSize: `${box.fontSize}px`,
                                            color: box.color,
                                            fontFamily: box.fontFamily,
                                            fontWeight: box.isBold ? 'bold' : 'normal',
                                            fontStyle: box.isItalic ? 'italic' : 'normal',
                                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                                            wordWrap: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                            textAlign: 'center',
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        {box.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Download Button */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={downloadMeme}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold transition"
                            >
                                📥 Download Meme
                            </button>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg p-6 h-fit sticky top-6 shadow-lg text-black">
                    {/* Template Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-black">Choose Template</label>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-full bg-gray-100 text-black p-2 rounded border border-purple-300 focus:border-purple-500"
                        >
                            {TEMPLATES.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Text Box Controls */}
                    {selectedBox && (
                        <>
                            <div className="border-t border-purple-200 pt-6">
                                <h3 className="text-lg font-semibold mb-4 text-black">Edit Text Box #{selectedBox.id}</h3>

                                {/* Text Input */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2 text-black">Text</label>
                                    <textarea
                                        value={selectedBox.text}
                                        onChange={(e) => updateTextBox(selectedBox.id, { text: e.target.value })}
                                        className="w-full bg-gray-100 text-black p-2 rounded border border-purple-300 focus:border-purple-500 text-sm"
                                        rows={3}
                                    />
                                </div>

                                {/* Font Family */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2 text-black">Font</label>
                                    <select
                                        value={selectedBox.fontFamily}
                                        onChange={(e) => updateTextBox(selectedBox.id, { fontFamily: e.target.value })}
                                        className="w-full bg-gray-100 text-black p-2 rounded border border-purple-300 focus:border-purple-500 text-sm"
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Courier">Courier New</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Comic Sans MS">Comic Sans MS</option>
                                    </select>
                                </div>

                                {/* Font Size */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2 text-black">
                                        Size: {selectedBox.fontSize}px
                                    </label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="72"
                                        value={selectedBox.fontSize}
                                        onChange={(e) => updateTextBox(selectedBox.id, { fontSize: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                {/* Color */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2 text-black">Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={selectedBox.color}
                                            onChange={(e) => updateTextBox(selectedBox.id, { color: e.target.value })}
                                            className="h-10 w-20 rounded cursor-pointer border border-purple-300"
                                        />
                                        <span className="flex items-center text-sm text-black">{selectedBox.color}</span>
                                    </div>
                                </div>

                                {/* Bold & Italic */}
                                <div className="mb-4 flex gap-2">
                                    <button
                                        onClick={() => updateTextBox(selectedBox.id, { isBold: !selectedBox.isBold })}
                                        className={`flex-1 py-2 px-3 rounded font-bold transition ${
                                            selectedBox.isBold ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
                                        }`}
                                    >
                                        B
                                    </button>
                                    <button
                                        onClick={() => updateTextBox(selectedBox.id, { isItalic: !selectedBox.isItalic })}
                                        className={`flex-1 py-2 px-3 rounded font-italic transition ${
                                            selectedBox.isItalic ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
                                        }`}
                                    >
                                        <em>I</em>
                                    </button>
                                </div>

                                {/* Remove Box */}
                                {textBoxes.length > 1 && (
                                    <button
                                        onClick={() => removeTextBox(selectedBox.id)}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition"
                                    >
                                        ✕ Remove Text Box
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Add Text Box */}
                    <button
                        onClick={addTextBox}
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold transition text-white"
                    >
                        + Add Text Box
                    </button>
                </div>
            </div>
        </div>
    );
}
