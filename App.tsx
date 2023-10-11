/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import util from './util'
import Container from './components/container'
import Dropdown from './components/dropdown'
import Input from './components/input'
import Option from './components/option'
import { ListOfNames } from './config'

function App(): JSX.Element {
	const inputRef = useRef<HTMLInputElement>(null)
	const isCickedOnOption = useRef<boolean>(false)
	const metaText = useRef<{ before: string, replaced: string, after: string }>({
		before: '',
		replaced: '',
		after: ''
	})

	const [text, setText] = useState<string>('')
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [dropDownStatus, checkDropDownStatus] = useState<boolean>(false)
	const [wordUnderCursor, setWordUnderCursor] = useState<string>('')

	const analyseCursorPositionToSetWordUnderCursor = () => {
		const cursorPosition = inputRef.current?.selectionStart || 0;

		const wordUnderCursor = util.getWordBasedOnCursorPosition(text, cursorPosition)

		setWordUnderCursor(wordUnderCursor)
		checkDropDownStatus(!dropDownStatus)
	}

	const shouldDropDownOpen = () => {
		if (
			wordUnderCursor.includes('@') &&
			wordUnderCursor.startsWith('@') &&
			wordUnderCursor.split('').filter((char) => char === '@').length === 1
		) {			
			const cursorStart = inputRef.current?.selectionStart || 0
			if (text.charAt(cursorStart) === '@') {
				return false
			}
			return true
		}
		return false
	}

	useEffect(() => {
		if (isCickedOnOption.current) {			
			inputRef.current?.focus()

			// set cursor position at the end of the replaced word
			const { before, replaced } = metaText.current || { before: '', replaced: '' }
			inputRef.current?.setSelectionRange(before.length + replaced.length, before.length + replaced.length)

			isCickedOnOption.current = false
		}
		setTimeout(() => {
			analyseCursorPositionToSetWordUnderCursor()
		}, 100)

	}, [text])

	useEffect(() => {
		wordUnderCursor ? 
			shouldDropDownOpen() ? setIsOpen(true) : setIsOpen(false) 
			: 
			setIsOpen(false)
	}, [wordUnderCursor, dropDownStatus])

	const onClickOutside = () => {
		setIsOpen(false)
	}

	const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			setTimeout(() => {
				analyseCursorPositionToSetWordUnderCursor()
			}, 100)
		}
	}

	const onInputMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
		event.stopPropagation()
		setTimeout(() => {
			analyseCursorPositionToSetWordUnderCursor()
		}, 100)
	}

	const onOptionClick = (name: string) => {
		let cursorPosition = inputRef.current?.selectionStart || 0;
		if (cursorPosition > 0) {
			cursorPosition = cursorPosition - 1
		}

		const { occurrences } = util.findWordOccurrences(text, wordUnderCursor)
		const { start, end } = util.getStartEndOfWord(occurrences, cursorPosition)

		const before = text.substring(0, start);
		const replaced = '@'+name+' ';
		const after = text.substring(end + 1);

		setText(before + replaced + after)

		// store this meta information to use it later for placing curosr at the right position
		metaText.current = {
			before,
			replaced,
			after
		}

		// to know user has clicked on the dropdown
		isCickedOnOption.current = true
	}

	const getList = () => {
		let list = ListOfNames
		if (wordUnderCursor) {
			if (shouldDropDownOpen() && wordUnderCursor.length > 1) {
				list = ListOfNames.filter((name) => {
					if (name.includes(wordUnderCursor.replace('@', ''))) {
						return true
					}
					return false
				})
			}
		}
		return list
	}

	return (
		<Container onClick={onClickOutside}>
			<div onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
				<Input
					type="text"
					value={text}
					ref={inputRef}
					onKeyDown={onInputKeyDown}
					placeholder="Type..."
					onMouseDown={onInputMouseDown}
					onChange={(event) => setText(event.target.value)}
				/>
				{isOpen &&
					<Dropdown>
						{getList().map((name) => {
							return (
								<Option
									key={name}
									onClick={(e) => {
										e.stopPropagation()
										onOptionClick(name)
									}}
								>
									{name}
								</Option>
							)
						})}
					</Dropdown>
				}
			</div>
		</Container>
	)
}

export default App
