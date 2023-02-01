import { SortType } from "../ts/enums";

export interface SortTypeData {
    type: SortType,
    title: string,
    body: string
}

const SortingTypeData: SortTypeData[] = [
    {
        type: SortType.INSERSTION_SORT,
        title: 'Insertion Sort',
        body: 'The Insertion Sort algorithm is a simple and efficient sorting method that works by repeatedly inserting elements into the correct position in a partially sorted list. The algorithm builds the final sorted array one item at a time, by comparing each new element with the already sorted elements and inserting it in the correct position. The process continues until the entire list is sorted. The algorithm is efficient for small lists and lists that are already partially sorted, but can be slow for large, unsorted lists. It is also a good choice for sorting lists in real-time as the elements are added, as it can quickly sort newly added elements without having to re-sort the entire list.'
    },
    {
        type: SortType.BUBBLE_SORT,
        title: 'Bubble Sort',
        body: 'The Bubble Sort algorithm is a simple sorting method that works by repeatedly swapping adjacent elements if they are in the wrong order, until the list is completely sorted. The algorithm compares each pair of elements and swaps them if they are in the wrong order, until no more swaps are needed. This process is repeated until the list is sorted. The algorithm gets its name from the way smaller elements "bubble" to the top of the list. Although the Bubble Sort algorithm is simple, it is not very efficient for large lists, as it requires multiple passes through the list. However, it can be useful for small lists and for educational purposes to help understand the basics of sorting algorithms.'
    },
    {
        type: SortType.SELECTION_SORT,
        title: 'Selection Sort',
        body: 'The Selection Sort algorithm is a simple sorting method that works by repeatedly selecting the smallest (or largest) element from the unsorted portion of the list and swapping it with the first element of the unsorted portion. This process is repeated until the entire list is sorted. The algorithm divides the list into two parts: a sorted portion and an unsorted portion. In each iteration, the smallest (or largest) element from the unsorted portion is selected and swapped with the first element of the unsorted portion, effectively moving the boundary between the sorted and unsorted portions one element to the right. The algorithm continues until the entire list is sorted. Although the Selection Sort algorithm is simple, it is not very efficient for large lists, as it requires multiple passes through the list and multiple comparisons for each pass. However, it can be useful for small lists and for educational purposes to help understand the basics of sorting algorithms.'
    }
]

export function GetSortingTypeData(type: string) {
    for (let i = 0; i < SortingTypeData.length; i++) {
        if(SortingTypeData[i].type === type)
            return SortingTypeData[i]
    }

    return undefined
}