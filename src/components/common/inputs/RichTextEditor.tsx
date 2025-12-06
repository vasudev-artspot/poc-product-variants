import { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { Box, Button } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import TitleIcon from "@mui/icons-material/Title";

const INLINE_STYLES = {
  FONTSIZE_16: {
    fontSize: "16px",
  },
  FONTSIZE_20: {
    fontSize: "20px",
  },
  FONTSIZE_24: {
    fontSize: "24px",
  },
};

interface RichTextEditorProps {
  value: any;
  onChange: (state: EditorState) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const toggleInlineStyle = (style: any) => {
    onChange(RichUtils.toggleInlineStyle(value, style));
  };

  const handleTextSizeChange = (newSize: any) => {
    const newEditorState = RichUtils.toggleInlineStyle(
      value,
      `FONTSIZE_${newSize}`
    );
    onChange(newEditorState);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    const content = value.getCurrentContent();
    if (!content.hasText()) {
      setIsFocused(false);
    }
  };

  return (
    <Box>
      {isFocused && (
        <Box>
          {/* <Button onClick={() => handleTextSizeChange('16')}>
            <TitleIcon sx={{ fontSize: '16px' }} />
          </Button>
          <Button onClick={() => handleTextSizeChange('20')}>
            <TitleIcon sx={{ fontSize: '20px' }} />
          </Button>
          <Button onClick={() => handleTextSizeChange('24')}>
            <TitleIcon sx={{ fontSize: '24px' }} />
          </Button>
          <Button onClick={() => toggleInlineStyle('BOLD')}>
            <FormatBoldIcon />
          </Button>
          <Button onClick={() => toggleInlineStyle('ITALIC')}>
            <FormatItalicIcon />
          </Button>
          <Button onClick={() => toggleInlineStyle('UNDERLINE')}>
            <FormatUnderlinedIcon />
          </Button> */}
        </Box>
      )}

      <Box mt={2} p={2} border={1} borderRadius={4} borderColor="grey.300">
        <Editor
          editorState={value}
          onChange={onChange}
          customStyleMap={INLINE_STYLES}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Box>
    </Box>
  );
};

export default RichTextEditor;
