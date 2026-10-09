#!/usr/bin/env python3
"""Merge EQsb library/effect/postprocess entries into an existing AOSP effects XML."""
import argparse
import copy
import sys
import xml.etree.ElementTree as ET


def local(tag):
    return tag.rsplit('}', 1)[-1]


def children_named(parent, name):
    return [child for child in list(parent) if local(child.tag) == name]


def merge_section(dst_root, src_root, section_name, key_attrs):
    src_sections = children_named(src_root, section_name)
    if not src_sections:
        return
    dst_sections = children_named(dst_root, section_name)
    if dst_sections:
        dst_section = dst_sections[0]
    else:
        dst_section = ET.SubElement(dst_root, src_sections[0].tag)
    for src_section in src_sections:
        for item in list(src_section):
            attrs = tuple(item.attrib.get(k, '') for k in key_attrs)
            found = None
            for existing in list(dst_section):
                if local(existing.tag) == local(item.tag) and tuple(existing.attrib.get(k, '') for k in key_attrs) == attrs:
                    found = existing
                    break
            if found is None:
                dst_section.append(copy.deepcopy(item))
            elif local(item.tag) == 'effect':
                # If the effect name already exists, it must not silently point elsewhere.
                for k, v in item.attrib.items():
                    if found.attrib.get(k) not in (None, v):
                        raise ValueError(f"conflicting effect '{attrs[0]}' attribute {k}: {found.attrib[k]} vs {v}")
                found.attrib.update(item.attrib)
        # Postprocess contains nested stream/apply entries; merge those without replacing OEM entries.
        if section_name == 'postprocess':
            for stream in list(src_section):
                stream_type = stream.attrib.get('type', '')
                dst_stream = next((s for s in list(dst_section) if local(s.tag) == 'stream' and s.attrib.get('type', '') == stream_type), None)
                if dst_stream is None:
                    dst_section.append(copy.deepcopy(stream))
                else:
                    for apply in list(stream):
                        name = apply.attrib.get('effect', '')
                        if not any(local(a.tag) == 'apply' and a.attrib.get('effect', '') == name for a in list(dst_stream)):
                            dst_stream.append(copy.deepcopy(apply))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('base_xml', help='existing device/vendor audio_effects_config.xml')
    ap.add_argument('eqsb_xml', help='EQsb fragment audio_effects_config_eqsb.xml')
    ap.add_argument('--output', help='output path; defaults to replacing base_xml')
    args = ap.parse_args()
    base_tree = ET.parse(args.base_xml)
    src_tree = ET.parse(args.eqsb_xml)
    root, src = base_tree.getroot(), src_tree.getroot()
    merge_section(root, src, 'libraries', ('name',))
    merge_section(root, src, 'effects', ('name',))
    merge_section(root, src, 'postprocess', ())
    out = args.output or args.base_xml
    ET.indent(base_tree, space='    ')
    base_tree.write(out, encoding='UTF-8', xml_declaration=True)
    ET.parse(out)  # verify the generated XML parses
    print(f'Merged EQsb into {out}')


if __name__ == '__main__':
    try:
        main()
    except (OSError, ET.ParseError, ValueError) as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        sys.exit(1)
