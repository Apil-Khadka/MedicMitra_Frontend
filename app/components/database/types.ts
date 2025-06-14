export interface Medicine {
    id: string;
    name: string;
    atcCode: string;
    description: string;
    isVerified: boolean;
    details?: {
        [key: string]: string | null;
    };
    sideEffects?: {
        [key: string]: string[] | null;
    };
    brandNames?: {
        [key: string]: string[] | null;
    };
    genericNames?: {
        [key: string]: string[] | null;
    };
    dosageForms?: {
        [key: string]: string[] | null;
    };
    diseases?: {
        [key: string]: string[] | null;
    };
}

export interface Topic {
    id: string;
    name: string;
}

export interface Cache {
    topics: Topic[];
    medicines: { [topicId: string]: Medicine[] };
}

export interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    placeholder: string;
    onClear: () => void;
    theme: any;
    language: 'en' | 'ne' | 'bh' | 'mai';
}

export interface TopicListProps {
    topics: Topic[];
    onTopicPress: (topic: Topic) => void;
    theme: any;
    language: 'en' | 'ne' | 'bh' | 'mai';
}

export interface MedicineListProps {
    medicines: Medicine[];
    theme: any;
    language: 'en' | 'ne' | 'bh' | 'mai';
    onLanguageChange: (language: 'en' | 'ne' | 'bh' | 'mai') => void;
}

export interface BackButtonProps {
    title: string;
    onPress: () => void;
    theme: any;
}

export interface EmptyStateProps {
    type: 'topic' | 'medicine';
    theme: any;
    language: 'en' | 'ne' | 'bh' | 'mai';
}

export interface MedicineDetailsProps {
    medicine: Medicine;
    theme: any;
    language: 'en' | 'ne' | 'bh' | 'mai';
    onLanguageChange: (language: 'en' | 'ne' | 'bh' | 'mai') => void;
}