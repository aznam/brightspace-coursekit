<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <span class="ck-hoverbox">
            
            <span class="ck-hoverbox__trigger">
                <xsl:value-of select="/*/@title"/>
            </span>
            
            <span class="ck-hoverbox__panel">
                <xsl:if test="string(/*/@panel-title)">
                    <span class="ck-hoverbox__panel-title">
                        <xsl:value-of select="/*/@panel-title"/>
                    </span>
                </xsl:if>
                
                <span class="ck-hoverbox__panel-body">
                    <ck-children/>
                </span>
            </span>

        </span>
    </xsl:template>
    
</xsl:stylesheet>