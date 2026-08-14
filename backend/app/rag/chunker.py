import os

def chunk_markdown(file_path: str):
    """
    Splits a markdown policy document into sections based on '## ' headers.
    Returns a list of dicts: {"policy_name": str, "section": str, "content": str, "source": str}
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    policy_name = os.path.basename(file_path).replace('.md', '').replace('_', ' ').title()
    source = os.path.basename(file_path)
    
    chunks = []
    current_section = "Introduction"
    current_content = []

    for line in lines:
        if line.startswith('# '):
            policy_name = line.replace('# ', '').strip()
        elif line.startswith('## '):
            # Save the previous section if it has content
            if current_content:
                content_str = ''.join(current_content).strip()
                if content_str:
                    chunks.append({
                        "policy_name": policy_name,
                        "section": current_section,
                        "content": content_str,
                        "source": source
                    })
            current_section = line.replace('## ', '').strip()
            current_content = []
        else:
            current_content.append(line)

    # Save the last section
    if current_content:
        content_str = ''.join(current_content).strip()
        if content_str:
            chunks.append({
                "policy_name": policy_name,
                "section": current_section,
                "content": content_str,
                "source": source
            })

    return chunks
